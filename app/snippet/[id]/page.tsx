import { notFound } from "next/navigation";
import { SnippetService } from "@/src/services/snippet-service";
import PublicSnippetClient from "@/src/components/viewer/PublicSnippetClient";

export default async function PublicSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await SnippetService.getById(id);

  if (!snippet) {
    notFound();
  }

  return (
    <PublicSnippetClient
      snippet={{
        id: snippet.id,
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        description: snippet.description,
        tags: snippet.tags,
        public: snippet.public,
        createdAt: snippet.createdAt.toISOString(),
        user: snippet.user,
      }}
    />
  );
}
