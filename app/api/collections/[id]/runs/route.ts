import { CollectionService } from "@/src/services/collections/collection-service";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import {
  handleApiError,
  unauthorizedResponse,
} from "@/src/lib/api/responses";
import { NextResponse } from "next/server";
import { z } from "zod";

const createRunSchema = z.object({
  title: z.string().max(128).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();
  if (!userId) return unauthorizedResponse();

  try {
    const runs = await CollectionService.getRuns(id, userId);
    return NextResponse.json(runs);
  } catch (error) {
    return handleApiError(error);
  }
}

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
    const { title } = createRunSchema.parse(body);
    const run = await CollectionService.createRun(id, userId, title);
    return NextResponse.json(run);
  } catch (error) {
    return handleApiError(error);
  }
}
