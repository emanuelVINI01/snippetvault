import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { collectionCreateSchema } from "@/src/lib/validations/collections";
import { CollectionService } from "@/src/services/collections/collection-service";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  const collections = await CollectionService.getAll(userId);
  return NextResponse.json(collections);
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const collection = await CollectionService.create(userId, collectionCreateSchema.parse(body));
    return NextResponse.json(collection);
  } catch (error) {
    return handleApiError(error);
  }
}
