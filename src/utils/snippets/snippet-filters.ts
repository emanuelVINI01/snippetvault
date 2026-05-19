import type { Snippet } from "@/src/types/snippet";

export function filterSnippets(snippets: Snippet[], query: string): Snippet[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return snippets;

  return snippets.filter((snippet) => matchesSnippet(snippet, normalizedQuery));
}

function matchesSnippet(snippet: Snippet, query: string): boolean {
  return (
    snippet.title.toLowerCase().includes(query) ||
    snippet.language.toLowerCase().includes(query) ||
    snippet.tags.some((tag) => tag.toLowerCase().includes(query)) ||
    Boolean(snippet.description?.toLowerCase().includes(query))
  );
}
