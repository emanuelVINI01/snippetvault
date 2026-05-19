"use client";

import { Globe2, Lock } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import type { Snippet } from "@/src/types/snippet";
import { getLanguageColor } from "../LanguageColors";

interface SnippetCardHeaderProps {
  snippet: Snippet;
}

export default function SnippetCardHeader({ snippet }: SnippetCardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold leading-snug text-dracula-fg">{snippet.title}</h3>
        {snippet.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-dracula-comment">{snippet.description}</p>
        )}
      </div>
      <div className="flex min-w-0 shrink-0 items-center gap-1.5">
        <span className={`max-w-[7rem] truncate rounded border px-2 py-0.5 font-mono text-xs ${getLanguageColor(snippet.language)}`}>
          {snippet.language}
        </span>
        {snippet.public ? (
          <Globe2 className="h-3.5 w-3.5 text-dracula-green" aria-label={t.common.public} />
        ) : (
          <Lock className="h-3.5 w-3.5 text-dracula-comment" aria-label={t.common.private} />
        )}
      </div>
    </div>
  );
}
