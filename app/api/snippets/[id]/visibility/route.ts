import { SnippetService } from "@/src/services/snippets/snippet-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";
import { z } from "zod";

const visibilitySchema = z.object({
  visibility: z.enum(["private", "unlisted", "public"]),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { visibility } = visibilitySchema.parse(body);
    const updated = await SnippetService.updateVisibility(id, userId, visibility);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
