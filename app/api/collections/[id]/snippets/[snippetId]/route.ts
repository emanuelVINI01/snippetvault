import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { CollectionService } from "@/src/services/collections/collection-service";
import { z } from "zod";

type CollectionSnippetRouteContext = {
  params: Promise<{ id: string; snippetId: string }>;
};

const updateItemSchema = z.object({
  filePath: z.string().max(256).nullable().optional(),
});

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

export async function PATCH(req: Request, { params }: CollectionSnippetRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id, snippetId } = await params;
    const body = await req.json();
    const { filePath } = updateItemSchema.parse(body);

    const collection = await CollectionService.updateCollectionItem(
      id,
      snippetId,
      userId,
      filePath ?? null,
    );
    return NextResponse.json(collection);
  } catch (error) {
    return handleApiError(error);
  }
}
