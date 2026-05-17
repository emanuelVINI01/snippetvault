"use client";

import type { PublicSnippetView } from "@/src/types/public-snippet";
import PublicSnippetCodePanel from "./PublicSnippetCodePanel";
import PublicSnippetHeader from "./PublicSnippetHeader";
import PublicSnippetHero from "./PublicSnippetHero";

interface PublicSnippetClientProps {
  snippet: PublicSnippetView;
}

export default function PublicSnippetClient({ snippet }: PublicSnippetClientProps) {
  return (
    <div className="min-h-screen text-dracula-fg">
      <PublicSnippetHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <PublicSnippetHero snippet={snippet} />
        <PublicSnippetCodePanel snippet={snippet} />
      </main>
    </div>
  );
}
