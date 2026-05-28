import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { CollectionService } from "@/src/services/collections/collection-service";

type CollectionSnippetRouteContext = {
  params: Promise<{ id: string; snippetId: string }>;
};

export async function DELETE(_req: Request, { params }: CollectionSnippetRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id, snippetId } = await params;
    const collection = await CollectionService.removeSnippet(id, snippetId, userId);
    return NextResponse.json(collection);
  } catch (error) {
    return handleApiError(error);
  }
}
