import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { snippetAiService } from "@/src/services/ai/snippet-ai-service";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    return NextResponse.json(await snippetAiService.getUsageSummary(userId));
  } catch (error) {
    return handleApiError(error);
  }
}
