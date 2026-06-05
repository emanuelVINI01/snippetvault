import { SnippetService } from "@/src/services/snippets/snippet-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";
import { z } from "zod";

const variablesSchema = z.array(
  z.object({
    name: z.string().min(1).max(64),
    label: z.string().max(128).optional().nullable(),
    description: z.string().max(256).optional().nullable(),
    defaultValue: z.string().max(1024).optional().nullable(),
    required: z.boolean().optional().default(true),
  })
);

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const variables = await SnippetService.getVariables(id, userId);
    return NextResponse.json(variables);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const validatedVariables = variablesSchema.parse(body);
    const updated = await SnippetService.updateVariables(id, userId, validatedVariables);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
