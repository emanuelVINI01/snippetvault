import { SnippetService } from "@/src/services/snippet-service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const snippets = await SnippetService.searchPublic(query);
    return NextResponse.json(snippets);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
