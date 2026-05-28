"use client";

import { Pencil, Sparkles, Trash2 } from "lucide-react";
import CopyButton from "@/src/components/shared/actions/CopyButton";
import ShareButton from "@/src/components/shared/actions/ShareButton";
import { useLanguage } from "@/src/context/LanguageContext";
import type { Snippet } from "@/src/types/snippet";

interface SnippetCardFooterProps {
  snippet: Snippet;
  onAi: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
}

export default function SnippetCardFooter({ onAi, onDelete, onEdit, snippet }: SnippetCardFooterProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 px-4 pb-4 pt-1">
      <SnippetTags tags={snippet.tags} />
      <SnippetActions snippet={snippet} onAi={onAi} onDelete={onDelete} onEdit={onEdit} />
    </div>
  );
}

function SnippetTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {tags.slice(0, 4).map((tag) => (
        <span
          key={tag}
          className="max-w-full rounded-full border border-dracula-purple/20 bg-dracula-purple/10 px-2 py-0.5 text-xs text-dracula-purple"
        >
          #{tag}
        </span>
      ))}
      {tags.length > 4 && (
        <span className="text-xs text-dracula-comment">+{tags.length - 4}</span>
      )}
    </div>
  );
}

function SnippetActions({
  onDelete,
  onEdit,
  onAi,
  snippet,
}: {
  onAi: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  snippet: Snippet;
}) {
  const { t } = useLanguage();
  const openAi = () => onAi(snippet);
  const editSnippet = () => onEdit(snippet);
  const deleteSnippet = () => onDelete(snippet);

  return (
    <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
      <CopyButton content={snippet.code} iconSize={14} />
      {snippet.public && <ShareButton snippetId={snippet.id} iconSize={14} />}
      <button
        onClick={openAi}
        className="rounded-lg p-1.5 text-dracula-comment transition-colors hover:bg-dracula-pink/10 hover:text-dracula-pink"
        title={t.ai.openAssistant}
      >
        <Sparkles className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={editSnippet}
        className="rounded-lg p-1.5 text-dracula-comment transition-colors hover:bg-dracula-purple/10 hover:text-dracula-purple"
        title={t.form.editTitle}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={deleteSnippet}
        className="rounded-lg p-1.5 text-dracula-comment transition-colors hover:bg-dracula-red/10 hover:text-dracula-red"
        title={t.form.delete}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
