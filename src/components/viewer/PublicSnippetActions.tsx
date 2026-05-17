"use client";

import { Code2, Tag } from "lucide-react";
import ShareButton from "@/src/components/ShareButton";
import type { PublicSnippetView } from "@/src/types/public-snippet";

interface PublicSnippetActionsProps {
  snippet: PublicSnippetView;
}

export default function PublicSnippetActions({ snippet }: PublicSnippetActionsProps) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-dracula-purple/20 bg-dracula-purple/10 px-3 py-1.5 font-mono text-sm text-dracula-purple">
          <Code2 className="h-4 w-4" />
          {snippet.language}
        </div>
        {snippet.public && (
          <ShareButton
            snippetId={snippet.id}
            iconSize={18}
            className="border border-dracula-card/60 bg-dracula-card/30 p-2"
          />
        )}
      </div>
      <SnippetTags tags={snippet.tags} />
    </div>
  );
}

function SnippetTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 rounded-lg border border-dracula-card bg-dracula-card/30 px-3 py-1.5 text-xs capitalize text-dracula-cyan"
        >
          <Tag className="h-3 w-3" />
          {tag}
        </span>
      ))}
    </div>
  );
}
