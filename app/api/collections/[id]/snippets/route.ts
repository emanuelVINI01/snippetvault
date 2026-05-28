import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { collectionSnippetSchema } from "@/src/lib/validations/collections";
import { CollectionService } from "@/src/services/collections/collection-service";

type CollectionSnippetRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: CollectionSnippetRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = collectionSnippetSchema.parse(await req.json());
    const collection = await CollectionService.addSnippet(id, body.snippetId, userId);
    return NextResponse.json(collection);
  } catch (error) {
    return handleApiError(error);
  }
}
