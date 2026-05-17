"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, Globe2, Lock } from "lucide-react";
import CopyButton from "../CopyButton";
import { getLanguageColor } from "./LanguageColors";
import ShareButton from "../ShareButton";
import { useLanguage } from "@/src/context/LanguageContext";
import { dracula, normalizeSnippetLanguage, SyntaxHighlighter } from "@/src/lib/syntax-highlighting";

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string | null;
  tags: string[];
  public: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
}

// Trim code preview to first 15 lines
function previewCode(code: string): string {
  const lines = code.split("\n");
  if (lines.length <= 15) return code;
  return lines.slice(0, 15).join("\n") + "\n// ...";
}

export default function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const langKey = normalizeSnippetLanguage(snippet.language);
  const langClass = getLanguageColor(snippet.language);
  const { t } = useLanguage();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-dracula-card bg-dracula-card/25 transition-shadow duration-200 hover:border-dracula-purple/40 hover:shadow-xl hover:shadow-dracula-purple/10"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-dracula-fg text-sm truncate leading-snug">{snippet.title}</h3>
          {snippet.description && (
            <p className="text-xs text-dracula-comment mt-0.5 line-clamp-1">{snippet.description}</p>
          )}
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-1.5">
          <span className={`max-w-[7rem] truncate rounded border px-2 py-0.5 font-mono text-xs ${langClass}`}>
            {snippet.language}
          </span>
          {snippet.public
            ? <Globe2 className="w-3.5 h-3.5 text-dracula-green" aria-label={t.common.public} />
            : <Lock    className="w-3.5 h-3.5 text-dracula-comment" aria-label={t.common.private} />
          }
        </div>
      </div>

      {/* Code preview */}
      <div className="mx-4 mb-3 max-w-full overflow-hidden rounded-xl border border-dracula-card text-xs">
        <SyntaxHighlighter
          language={langKey}
          style={dracula}
          customStyle={{
            margin: 0,
            padding: "12px 14px",
            fontSize: "0.72rem",
            maxHeight: "180px",
            background: "transparent",
          }}
          showLineNumbers={false}
          wrapLines
        >
          {previewCode(snippet.code)}
        </SyntaxHighlighter>
      </div>

      {/* Footer */}
      <div className="flex min-w-0 items-center justify-between gap-3 px-4 pb-4 pt-1">
        {/* Tags */}
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {snippet.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="max-w-full rounded-full border border-dracula-purple/20 bg-dracula-purple/10 px-2 py-0.5 text-xs text-dracula-purple"
            >
              #{tag}
            </span>
          ))}
          {snippet.tags.length > 4 && (
            <span className="text-xs text-dracula-comment">+{snippet.tags.length - 4}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <CopyButton content={snippet.code} iconSize={14} />
          {snippet.public && (
            <ShareButton snippetId={snippet.id} iconSize={14} />
          )}
          <button
            onClick={() => onEdit(snippet)}
            className="p-1.5 rounded-lg text-dracula-comment hover:text-dracula-purple hover:bg-dracula-purple/10 transition-colors"
            title={t.form.editTitle}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(snippet)}
            className="p-1.5 rounded-lg text-dracula-comment hover:text-dracula-red hover:bg-dracula-red/10 transition-colors"
            title={t.form.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
