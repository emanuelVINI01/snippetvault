import { auth } from "@/src/auth"; // Certifique-react se o caminho do seu Auth.js está correto
import { SnippetService } from "@/src/services/snippet-service";
import { createSnippetSchema } from "@/src/lib/validations/snippet";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const snippets = await SnippetService.getAll(session.user.id);
  return NextResponse.json(snippets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const validatedData = createSnippetSchema.parse(body);
    const snippet = await SnippetService.create(session.user.id, validatedData);
    return NextResponse.json(snippet);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
