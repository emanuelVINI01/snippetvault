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
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6 px-3 py-6 sm:gap-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <PublicSnippetHero snippet={snippet} />
        </div>
        <PublicSnippetCodePanel snippet={snippet} />
      </main>
    </div>
  );
}
