import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/responses";
import { aiSnippetRequestSchema } from "@/src/lib/validations/ai";
import {
  AiConfigurationError,
  AiUsageLimitError,
  snippetAiService,
} from "@/src/services/ai/snippet-ai-service";
import { SnippetService } from "@/src/services/snippets/snippet-service";

type AiSnippetRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: AiSnippetRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id } = await params;
    const snippet = await SnippetService.getOwnedById(id, userId);
    if (!snippet) return notFoundResponse();

    const body = await req.json().catch(() => ({}));
    const { locale } = aiSnippetRequestSchema.parse(body);
    const response = await snippetAiService.analyzeSnippet(userId, snippet, locale);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof AiUsageLimitError) {
      return NextResponse.json({ error: "AI usage limit reached" }, { status: 429 });
    }
    if (error instanceof AiConfigurationError) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 503 });
    }

    return handleApiError(error);
  }
}
