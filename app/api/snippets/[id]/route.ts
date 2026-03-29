import { auth } from "@/src/auth";
import { SnippetService } from "@/src/services/snippet-service";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const updated = await SnippetService.update(params.id, session.user.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  await SnippetService.delete(params.id, session.user.id);
  return new NextResponse(null, { status: 204 });
}