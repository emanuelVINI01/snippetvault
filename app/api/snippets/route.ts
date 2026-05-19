import { SnippetService } from "@/src/services/snippets/snippet-service";
import { createSnippetSchema } from "@/src/lib/validations/snippet";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { handleApiError, unauthorizedResponse } from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  const snippets = await SnippetService.getAll(userId);
  return NextResponse.json(snippets);
}

export async function POST(req: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const validatedData = createSnippetSchema.parse(body);
    const snippet = await SnippetService.create(userId, validatedData);
    return NextResponse.json(snippet);
  } catch (error) {
    return handleApiError(error);
  }
}
