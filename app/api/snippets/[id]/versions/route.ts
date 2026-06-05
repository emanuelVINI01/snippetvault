import { SnippetService } from "@/src/services/snippets/snippet-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const versions = await SnippetService.getVersions(id, userId);
    return NextResponse.json(versions);
  } catch (error) {
    return handleApiError(error);
  }
}
