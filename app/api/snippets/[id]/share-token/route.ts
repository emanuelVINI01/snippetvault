import { SnippetService } from "@/src/services/snippets/snippet-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";
import { z } from "zod";

const shareTokenSchema = z.object({
  expiresAt: z.string().datetime().optional().nullable(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Empty or invalid body
    }
    const { expiresAt } = shareTokenSchema.parse(body);
    const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
    const updated = await SnippetService.generateShareToken(id, userId, expiresAtDate);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const updated = await SnippetService.revokeShareToken(id, userId);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
