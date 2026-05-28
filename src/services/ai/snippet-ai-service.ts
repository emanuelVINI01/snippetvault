import { createHash } from "crypto";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/src/prisma";
import {
  aiSnippetAnalysisSchema,
  type AiSnippetAnalysis,
} from "@/src/lib/validations/ai";
import type { AiUsageSummary } from "@/src/types/ai";

const DEFAULT_AI_DAILY_LIMIT = 50;
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export class AiUsageLimitError extends Error {
  constructor() {
    super("AI usage limit reached");
  }
}

export class AiConfigurationError extends Error {
  constructor() {
    super("Gemini API key is not configured");
  }
}

class SnippetAiService {
  async analyzeSnippet(userId: string, snippet: SnippetAiSource, locale: "pt" | "en") {
    const normalizedCode = normalizeCodeForHash(snippet.code);
    const codeHash = getSnippetCodeHash(normalizedCode);
    const model = getGeminiModel();
    const cached = await prisma.aiSnippetAnalysis.findUnique({ where: { codeHash } });

    if (cached) {
      await this.recordUsageEvent({
        cacheHit: true,
        codeHash,
        model: cached.model,
        snippetId: snippet.id,
        userId,
      });

      return {
        analysis: aiSnippetAnalysisSchema.parse(cached.result),
        cacheHit: true,
        codeHash,
        model: cached.model,
        usage: await this.getUsageSummary(userId),
      };
    }

    const usage = await this.getUsageSummary(userId);
    if (usage.remaining <= 0) {
      throw new AiUsageLimitError();
    }

    const analysis = await generateSnippetAnalysis(snippet, normalizedCode, locale, model);
    await prisma.aiSnippetAnalysis.create({
      data: {
        codeHash,
        model,
        normalizedLength: normalizedCode.length,
        result: analysis,
      },
    });
    await this.recordUsageEvent({
      cacheHit: false,
      codeHash,
      model,
      snippetId: snippet.id,
      userId,
    });

    return {
      analysis,
      cacheHit: false,
      codeHash,
      model,
      usage: await this.getUsageSummary(userId),
    };
  }

  async getUsageSummary(userId: string): Promise<AiUsageSummary> {
    const { end, start } = getUsageWindow();
    const [used, cacheHits, totalRequests] = await Promise.all([
      prisma.aiUsageEvent.count({
        where: { userId, cacheHit: false, createdAt: { gte: start, lt: end } },
      }),
      prisma.aiUsageEvent.count({
        where: { userId, cacheHit: true, createdAt: { gte: start, lt: end } },
      }),
      prisma.aiUsageEvent.count({
        where: { userId, createdAt: { gte: start, lt: end } },
      }),
    ]);
    const limit = getAiDailyLimit();

    return {
      cacheHits,
      limit,
      periodEnd: end.toISOString(),
      periodStart: start.toISOString(),
      remaining: Math.max(limit - used, 0),
      totalRequests,
      used,
    };
  }

  private recordUsageEvent(input: {
    cacheHit: boolean;
    codeHash: string;
    model: string;
    snippetId: string;
    userId: string;
  }) {
    return prisma.aiUsageEvent.create({ data: input });
  }
}

async function generateSnippetAnalysis(
  snippet: SnippetAiSource,
  normalizedCode: string,
  locale: "pt" | "en",
  model: string,
): Promise<AiSnippetAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AiConfigurationError();

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(snippet, normalizedCode, locale),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: SNIPPET_ANALYSIS_JSON_SCHEMA,
      temperature: 0.35,
    },
  });

  return aiSnippetAnalysisSchema.parse(JSON.parse(response.text ?? "{}"));
}

function buildPrompt(snippet: SnippetAiSource, code: string, locale: "pt" | "en") {
  const outputLanguage = locale === "pt" ? "Portuguese from Brazil" : "English";

  return [
    "You are SnippetVault's senior code assistant.",
    `Reply only in ${outputLanguage}.`,
    "Return one compact JSON object matching the provided schema.",
    "Cover all requested jobs in this single response: explain, generate description, suggest language/tags, find bugs, refactor, and provide usage example.",
    "Keep refactored code practical and preserve the original intent. If no bug is obvious, return low-severity improvement findings.",
    `Title: ${snippet.title}`,
    `Current language: ${snippet.language}`,
    `Current description: ${snippet.description ?? "none"}`,
    `Current tags: ${snippet.tags.join(", ") || "none"}`,
    "Code:",
    "```",
    code,
    "```",
  ].join("\n");
}

export function normalizeCodeForHash(code: string) {
  return code.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export function getSnippetCodeHash(normalizedCode: string) {
  return createHash("sha256").update(normalizedCode, "utf8").digest("hex");
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

function getAiDailyLimit() {
  const configuredLimit = Number(process.env.AI_DAILY_LIMIT);
  return Number.isFinite(configuredLimit) && configuredLimit > 0
    ? Math.floor(configuredLimit)
    : DEFAULT_AI_DAILY_LIMIT;
}

function getUsageWindow() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { end, start };
}

export const snippetAiService = new SnippetAiService();

interface SnippetAiSource {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string | null;
  tags: string[];
}

const SNIPPET_ANALYSIS_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "description", "language", "tags", "bugs", "refactor", "example"],
  properties: {
    summary: { type: "string" },
    description: { type: "string" },
    language: { type: "string" },
    tags: {
      type: "array",
      maxItems: 8,
      items: { type: "string" },
    },
    bugs: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "severity", "detail"],
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          detail: { type: "string" },
        },
      },
    },
    refactor: {
      type: "object",
      additionalProperties: false,
      required: ["notes", "code"],
      properties: {
        notes: {
          type: "array",
          maxItems: 6,
          items: { type: "string" },
        },
        code: { type: "string" },
      },
    },
    example: {
      type: "object",
      additionalProperties: false,
      required: ["title", "code", "notes"],
      properties: {
        title: { type: "string" },
        code: { type: "string" },
        notes: { type: "string" },
      },
    },
  },
};
