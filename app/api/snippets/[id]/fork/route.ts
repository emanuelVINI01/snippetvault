import { SnippetService } from "@/src/services/snippets/snippet-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const forked = await SnippetService.fork(id, userId);
    return NextResponse.json(forked);
  } catch (error) {
    return handleApiError(error);
  }
}
