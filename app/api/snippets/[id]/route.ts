import { SnippetService } from "@/src/services/snippets/snippet-service";
import { updateSnippetSchema } from "@/src/lib/validations/snippet";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  internalErrorResponse,
  noContentResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const snippet = await SnippetService.getById(id);
    if (!snippet) return notFoundResponse();
    return NextResponse.json(snippet);
  } catch {
    return internalErrorResponse();
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const validatedData = updateSnippetSchema.parse(body);
    const updated = await SnippetService.update(id, userId, validatedData);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  await SnippetService.delete(id, userId);
  return noContentResponse();
}
