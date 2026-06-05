import { SnippetService } from "@/src/services/snippets/snippet-service";
import { snippetAiService } from "@/src/services/ai/snippet-ai-service";
import { internalErrorResponse } from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const semantic = searchParams.get("semantic") === "true";

    if (semantic && query.trim()) {
      try {
        const candidates = await SnippetService.searchPublic("");
        const formattedCandidates = candidates.map(c => ({
          id: c.id,
          title: c.title,
          description: c.description,
          tags: c.tags,
        }));

        const matchedIds = await snippetAiService.semanticSearchReRank(query, formattedCandidates);
        if (matchedIds && matchedIds.length > 0) {
          const matchedSnippets = matchedIds
            .map(id => candidates.find(c => c.id === id))
            .filter((c): c is NonNullable<typeof c> => !!c);
          return NextResponse.json(matchedSnippets);
        }
      } catch (err) {
        console.error("Semantic search failed, falling back to standard search:", err);
      }
    }

    const snippets = await SnippetService.searchPublic(query);
    return NextResponse.json(snippets);
  } catch {
    return internalErrorResponse();
  }
}
