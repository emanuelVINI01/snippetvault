import { SnippetService } from "@/src/services/snippets/snippet-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  const { id, versionId } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const version = await SnippetService.getVersion(id, versionId, userId);
    if (!version) return notFoundResponse();
    return NextResponse.json(version);
  } catch (error) {
    return handleApiError(error);
  }
}
