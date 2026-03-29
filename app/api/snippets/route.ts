import { auth } from "@/src/auth"; // Certifique-react se o caminho do seu Auth.js está correto
import { SnippetService } from "@/src/services/snippet-service";
import { createSnippetSchema } from "@/src/lib/validations/snippet";
import { NextResponse } from "next/server";

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
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}