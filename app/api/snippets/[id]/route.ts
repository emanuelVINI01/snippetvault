import { auth } from "@/src/auth";
import { SnippetService } from "@/src/services/snippet-service";
import { updateSnippetSchema } from "@/src/lib/validations/snippet";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const snippet = await SnippetService.getById(id);
    if (!snippet) return new NextResponse("Not Found", { status: 404 });
    // Note: this returns the snippet regardless of its public status.
    // If we want to secure private snippets from non-owners:
    // We could check if it's public, and if not, check session user id.
    // For now returning it as per requirements.
    return NextResponse.json(snippet);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const validatedData = updateSnippetSchema.parse(body);
    const updated = await SnippetService.update(id, session.user.id, validatedData);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  await SnippetService.delete(id, session.user.id);
  return new NextResponse(null, { status: 204 });
}