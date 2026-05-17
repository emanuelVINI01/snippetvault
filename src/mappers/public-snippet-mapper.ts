import type { PublicSnippetSource, PublicSnippetView } from "@/src/types/public-snippet";

export function mapPublicSnippetView(snippet: PublicSnippetSource): PublicSnippetView {
  return {
    id: snippet.id,
    title: snippet.title,
    code: snippet.code,
    language: snippet.language,
    description: snippet.description,
    tags: snippet.tags,
    public: snippet.public,
    createdAt: snippet.createdAt.toISOString(),
    user: snippet.user,
  };
}
