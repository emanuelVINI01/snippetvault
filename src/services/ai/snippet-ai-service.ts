import { createHash } from "crypto";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/src/prisma";
import { Prisma } from "@/prisma/generated/client";
import {
  aiSnippetAnalysisSchema,
  type AiSnippetAnalysis,
} from "@/src/lib/validations/ai";
import type { AiUsageSummary } from "@/src/types/ai";

function isPendingResult(result: unknown): boolean {
  return Boolean(
    result && typeof result === "object" && (result as { status?: string }).status === "pending",
  );
}

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

export class AiConcurrencyError extends Error {
  constructor() {
    super("Another AI operation is already in progress");
  }
}

const activeUserLocks = new Set<string>();

class SnippetAiService {
  async analyzeSnippet(userId: string, snippet: SnippetAiSource, locale: "pt" | "en", checkOnly?: boolean, forceRefresh?: boolean) {
    if (!checkOnly) {
      if (activeUserLocks.has(userId)) {
        throw new AiConcurrencyError();
      }
      activeUserLocks.add(userId);
    }

    try {
      const normalizedCode = normalizeCodeForHash(snippet.code);
      const codeHash = getSnippetCodeHash(normalizedCode);
      const model = getGeminiModel();

      if (forceRefresh) {
        try {
          await prisma.aiSnippetAnalysis.delete({ where: { codeHash } });
        } catch {}
      }

      let cached = forceRefresh ? null : await prisma.aiSnippetAnalysis.findUnique({ where: { codeHash } });

      if (cached) {
        if (isPendingResult(cached.result)) {
          // Another concurrent request is analyzing this snippet. Poll until finished.
          let attempts = 0;
          while (attempts < 60) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await prisma.aiSnippetAnalysis.findUnique({ where: { codeHash } });
            if (!cached) {
              // The other request failed and deleted the pending record.
              break;
            }
            if (!isPendingResult(cached.result)) {
              break;
            }
            attempts++;
          }
        }

        if (cached && !isPendingResult(cached.result)) {
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

        if (cached && isPendingResult(cached.result)) {
          try {
            await prisma.aiSnippetAnalysis.delete({ where: { codeHash } });
          } catch {}
          throw new Error("AI analysis timed out. Please try again.");
        }
      }

      if (checkOnly) {
        return {
          analysis: null,
          cacheHit: false,
          usage: await this.getUsageSummary(userId),
        };
      }

      let pendingRecordCreated = false;
      try {
        await prisma.aiSnippetAnalysis.create({
          data: {
            codeHash,
            model,
            normalizedLength: normalizedCode.length,
            result: { status: "pending" },
          },
        });
        pendingRecordCreated = true;
      } catch (error) {
        // If codeHash already exists due to unique constraint, another request created it concurrently
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          let attempts = 0;
          while (attempts < 60) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            cached = await prisma.aiSnippetAnalysis.findUnique({ where: { codeHash } });
            if (!cached) {
              break;
            }
            if (!isPendingResult(cached.result)) {
              break;
            }
            attempts++;
          }

          if (cached && !isPendingResult(cached.result)) {
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

          if (cached && isPendingResult(cached.result)) {
            try {
              await prisma.aiSnippetAnalysis.delete({ where: { codeHash } });
            } catch {}
            throw new Error("AI analysis timed out. Please try again.");
          }
        }

        // If it's some other database error, rethrow it
        throw error;
      }

      if (pendingRecordCreated) {
        try {
          const usage = await this.getUsageSummary(userId);
          if (usage.remaining <= 0) {
            throw new AiUsageLimitError();
          }

          const analysis = await generateSnippetAnalysis(snippet, normalizedCode, locale, model);
          await prisma.aiSnippetAnalysis.update({
            where: { codeHash },
            data: { result: analysis },
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
        } catch (error) {
          // Crucial: remove the pending lock record on failure so we don't block subsequent attempts
          try {
            await prisma.aiSnippetAnalysis.delete({ where: { codeHash } });
          } catch {}
          throw error;
        }
      }

      throw new Error("Failed to process AI analysis.");
    } finally {
      if (!checkOnly) {
        activeUserLocks.delete(userId);
      }
    }
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

  async generateTests(
    userId: string,
    snippet: SnippetAiSource,
    framework: string,
    locale: "pt" | "en",
    forceRefresh?: boolean
  ) {
    if (activeUserLocks.has(userId)) {
      throw new AiConcurrencyError();
    }
    activeUserLocks.add(userId);

    try {
      const normalizedCode = normalizeCodeForHash(snippet.code);
      const codeHash = getSnippetCodeHash(normalizedCode);
      const model = getGeminiModel();

      if (forceRefresh) {
        try {
          await prisma.aiGeneratedDoc.deleteMany({
            where: { targetType: "tests", targetId: snippet.id, locale, codeHash }
          });
        } catch {}
      }

      const cached = forceRefresh ? null : await prisma.aiGeneratedDoc.findFirst({
        where: { targetType: "tests", targetId: snippet.id, locale, codeHash }
      });

      if (cached) {
        await this.recordUsageEvent({
          cacheHit: true,
          codeHash,
          model: cached.model,
          snippetId: snippet.id,
          userId,
        });
        return {
          result: cached.result as { testCode: string; setupInstructions: string },
          cacheHit: true,
          usage: await this.getUsageSummary(userId),
        };
      }

      const usage = await this.getUsageSummary(userId);
      if (usage.remaining <= 0) throw new AiUsageLimitError();

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.startsWith("replace-with-")) throw new AiConfigurationError();

      const ai = new GoogleGenAI({ apiKey });
      const outputLanguage = locale === "pt" ? "Portuguese from Brazil" : "English";
      const prompt = [
        "You are an expert testing assistant.",
        `Write unit tests using the ${framework} framework for the code snippet below.`,
        `Provide step-by-step setup instructions in ${outputLanguage}.`,
        "Return a single JSON object matching the provided schema.",
        `Snippet Title: ${snippet.title}`,
        `Language: ${snippet.language}`,
        "Code:",
        "```",
        normalizedCode,
        "```"
      ].join("\n");

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            additionalProperties: false,
            required: ["testCode", "setupInstructions"],
            properties: {
              testCode: { type: "string" },
              setupInstructions: { type: "string" }
            }
          },
          temperature: 0.2,
        }
      });

      const parsed = JSON.parse(response.text ?? "{}");

      await prisma.aiGeneratedDoc.create({
        data: {
          targetType: "tests",
          targetId: snippet.id,
          codeHash,
          model,
          locale,
          result: parsed,
        }
      });

      await this.recordUsageEvent({
        cacheHit: false,
        codeHash,
        model,
        snippetId: snippet.id,
        userId,
      });

      return {
        result: parsed as { testCode: string; setupInstructions: string },
        cacheHit: false,
        usage: await this.getUsageSummary(userId),
      };
    } finally {
      activeUserLocks.delete(userId);
    }
  }

  async generateDocumentation(
    userId: string,
    snippet: SnippetAiSource,
    locale: "pt" | "en",
    forceRefresh?: boolean
  ) {
    if (activeUserLocks.has(userId)) {
      throw new AiConcurrencyError();
    }
    activeUserLocks.add(userId);

    try {
      const normalizedCode = normalizeCodeForHash(snippet.code);
      const codeHash = getSnippetCodeHash(normalizedCode);
      const model = getGeminiModel();

      if (forceRefresh) {
        try {
          await prisma.aiGeneratedDoc.deleteMany({
            where: { targetType: "documentation", targetId: snippet.id, locale, codeHash }
          });
        } catch {}
      }

      const cached = forceRefresh ? null : await prisma.aiGeneratedDoc.findFirst({
        where: { targetType: "documentation", targetId: snippet.id, locale, codeHash }
      });

      if (cached) {
        await this.recordUsageEvent({
          cacheHit: true,
          codeHash,
          model: cached.model,
          snippetId: snippet.id,
          userId,
        });
        return {
          result: cached.result as { readme: string; docBlocks: string },
          cacheHit: true,
          usage: await this.getUsageSummary(userId),
        };
      }

      const usage = await this.getUsageSummary(userId);
      if (usage.remaining <= 0) throw new AiUsageLimitError();

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.startsWith("replace-with-")) throw new AiConfigurationError();

      const ai = new GoogleGenAI({ apiKey });
      const outputLanguage = locale === "pt" ? "Portuguese from Brazil" : "English";
      const prompt = [
        "You are an expert technical writer.",
        `Write a comprehensive README.md (markdown) and standard documentation blocks (comments or details) in ${outputLanguage} for the code snippet below.`,
        "Return a single JSON object matching the provided schema.",
        `Snippet Title: ${snippet.title}`,
        `Language: ${snippet.language}`,
        "Code:",
        "```",
        normalizedCode,
        "```"
      ].join("\n");

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            additionalProperties: false,
            required: ["readme", "docBlocks"],
            properties: {
              readme: { type: "string" },
              docBlocks: { type: "string" }
            }
          },
          temperature: 0.3,
        }
      });

      const parsed = JSON.parse(response.text ?? "{}");

      await prisma.aiGeneratedDoc.create({
        data: {
          targetType: "documentation",
          targetId: snippet.id,
          codeHash,
          model,
          locale,
          result: parsed,
        }
      });

      await this.recordUsageEvent({
        cacheHit: false,
        codeHash,
        model,
        snippetId: snippet.id,
        userId,
      });

      return {
        result: parsed as { readme: string; docBlocks: string },
        cacheHit: false,
        usage: await this.getUsageSummary(userId),
      };
    } finally {
      activeUserLocks.delete(userId);
    }
  }

  async semanticSearchReRank(
    query: string,
    candidates: { id: string; title: string; description: string | null; tags: string[] }[]
  ): Promise<string[]> {
    if (!query.trim() || candidates.length === 0) return [];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith("replace-with-")) throw new AiConfigurationError();

    const ai = new GoogleGenAI({ apiKey });
    const model = getGeminiModel();

    const prompt = [
      "You are a semantic search assistant.",
      "The user is searching for a code snippet with this search query:",
      `Query: "${query}"`,
      "",
      "Here is the list of candidate snippets:",
      JSON.stringify(candidates.map(c => ({ id: c.id, title: c.title, description: c.description, tags: c.tags }))),
      "",
      "Analyze the semantic match of each candidate against the query.",
      "Filter out candidates that are completely irrelevant.",
      "Return a JSON object containing the list of matching snippet IDs in order of relevance, matching the schema:",
      JSON.stringify({
        type: "object",
        required: ["matchingIds"],
        properties: {
          matchingIds: {
            type: "array",
            items: { type: "string" }
          }
        }
      })
    ].join("\n");

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: {
            type: "object",
            additionalProperties: false,
            required: ["matchingIds"],
            properties: {
              matchingIds: {
                type: "array",
                items: { type: "string" }
              }
            }
          },
          temperature: 0.1,
        }
      });

      const parsed = JSON.parse(response.text ?? "{}");
      return parsed.matchingIds || [];
    } catch (e) {
      console.error("Semantic search failed:", e);
      return [];
    }
  }
}

async function generateSnippetAnalysis(
  snippet: SnippetAiSource,
  normalizedCode: string,
  locale: "pt" | "en",
  model: string,
): Promise<AiSnippetAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "replace-with-gemini-api-key" || apiKey.startsWith("replace-with-")) {
    throw new AiConfigurationError();
  }

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
    "Cover all requested jobs in this single response: explain (quick, technical, line-by-line of key lines), generate description, suggest language/tags, find bugs, refactor, provide usage example, detect dependencies/requirements, generate quality score (0-100), and write a security report (riskLevel and findings).",
    "Keep refactored code practical and preserve original intent. If no bug is obvious, return low-severity improvement findings.",
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
  required: [
    "summary",
    "description",
    "language",
    "tags",
    "bugs",
    "refactor",
    "example",
    "qualityScore",
    "securityReport",
    "requirements",
    "explanations"
  ],
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
    qualityScore: {
      type: "integer",
      minimum: 0,
      maximum: 100
    },
    securityReport: {
      type: "object",
      additionalProperties: false,
      required: ["riskLevel", "findings"],
      properties: {
        riskLevel: { type: "string", enum: ["low", "medium", "high"] },
        findings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["title", "description"],
            properties: {
              title: { type: "string" },
              description: { type: "string" }
            }
          }
        }
      }
    },
    requirements: {
      type: "array",
      maxItems: 10,
      items: { type: "string" }
    },
    explanations: {
      type: "object",
      additionalProperties: false,
      required: ["quick", "technical", "lineByLine"],
      properties: {
        quick: { type: "string" },
        technical: { type: "string" },
        lineByLine: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["line", "explanation"],
            properties: {
              line: { type: "string" },
              explanation: { type: "string" }
            }
          }
        }
      }
    }
  },
};
