import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import {
  AiConfigurationError,
  AiUsageLimitError,
  AiConcurrencyError,
  snippetAiService,
} from "@/src/services/ai/snippet-ai-service";
import { SnippetService } from "@/src/services/snippets/snippet-service";
import { z } from "zod";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const testsRequestSchema = z.object({
  framework: z.string().min(1).max(64),
  locale: z.enum(["pt", "en"]).default("pt"),
  forceRefresh: z.boolean().optional(),
});

export async function POST(req: Request, { params }: RouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id } = await params;
    const snippet = await SnippetService.getOwnedById(id, userId);
    if (!snippet) return notFoundResponse();

    const body = await req.json().catch(() => ({}));
    const { framework, locale, forceRefresh } = testsRequestSchema.parse(body);

    const response = await snippetAiService.generateTests(
      userId,
      snippet,
      framework,
      locale,
      forceRefresh,
    );

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AiUsageLimitError) {
      return NextResponse.json({ error: "AI usage limit reached" }, { status: 429 });
    }
    if (error instanceof AiConcurrencyError) {
      return NextResponse.json({ error: "Another AI request is already in progress" }, { status: 429 });
    }
    if (error instanceof AiConfigurationError) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 503 });
    }
    return handleApiError(error);
  }
}
