import { NextResponse } from "next/server";
import {
  handleApiError,
  noContentResponse,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { collectionUpdateSchema } from "@/src/lib/validations/collections";
import { CollectionService } from "@/src/services/collections/collection-service";

type CollectionRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: CollectionRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await req.json();
    const collection = await CollectionService.update(
      id,
      userId,
      collectionUpdateSchema.parse(body),
    );
    return NextResponse.json(collection);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: Request, { params }: CollectionRouteContext) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const { id } = await params;
    await CollectionService.delete(id, userId);
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
