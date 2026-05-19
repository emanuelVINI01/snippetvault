"use client";

import { Calendar, User } from "lucide-react";
import { formatLongDate } from "@/src/utils/formatters/date-formatters";
import type { PublicSnippetView } from "@/src/types/public-snippet";
import { useLanguage } from "@/src/context/LanguageContext";

interface PublicSnippetMetaProps {
  snippet: PublicSnippetView;
}

export default function PublicSnippetMeta({ snippet }: PublicSnippetMetaProps) {
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-dracula-comment">
      <span className="rounded-full border border-dracula-cyan/20 bg-dracula-cyan/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-dracula-cyan">
        {t.snippetPage.sharedSnippet}
      </span>
      {snippet.user?.name && (
        <span className="flex items-center gap-1.5 rounded-full border border-dracula-card/60 bg-dracula-card/30 px-2.5 py-1 text-dracula-fg">
          <User className="h-3.5 w-3.5" />
          {snippet.user.name}
        </span>
      )}
      <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-dracula-comment">
        <Calendar className="h-3.5 w-3.5" />
        {formatLongDate(snippet.createdAt, language)}
      </span>
    </div>
  );
}
