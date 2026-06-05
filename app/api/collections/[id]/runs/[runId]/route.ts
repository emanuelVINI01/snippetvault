import { CollectionService } from "@/src/services/collections/collection-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateRunSchema = z.object({
  status: z.enum(["active", "completed", "abandoned"]).optional(),
  items: z.array(
    z.object({
      id: z.string(),
      status: z.enum(["pending", "done", "skipped"]).optional(),
      notes: z.string().max(2048).optional().nullable(),
    })
  ).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; runId: string }> }
) {
  const { id, runId } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const run = await CollectionService.getRunById(runId, id, userId);
    if (!run) return notFoundResponse();
    return NextResponse.json(run);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; runId: string }> }
) {
  const { id, runId } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const body = await req.json();
    const validatedData = updateRunSchema.parse(body);
    const updated = await CollectionService.updateRun(runId, id, userId, validatedData);
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
