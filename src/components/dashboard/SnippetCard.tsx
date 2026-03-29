"use client";

import { Pencil, Trash2, Globe2, Lock } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyButton from "../CopyButton";
import { getLanguageColor } from "./LanguageColors";
import ShareButton from "../ShareButton";

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
  const langKey = snippet.language.toLowerCase();
  const langClass = getLanguageColor(snippet.language);

  return (
    <article className="group flex flex-col rounded-2xl border border-dracula-card hover:border-dracula-purple/40 bg-dracula-card/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-dracula-purple/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-dracula-fg text-sm truncate leading-snug">{snippet.title}</h3>
          {snippet.description && (
            <p className="text-xs text-dracula-comment mt-0.5 line-clamp-1">{snippet.description}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${langClass}`}>
            {snippet.language}
          </span>
          {snippet.public
            ? <Globe2 className="w-3.5 h-3.5 text-dracula-green" aria-label="Público" />
            : <Lock    className="w-3.5 h-3.5 text-dracula-comment" aria-label="Privado" />
          }
        </div>
      </div>

      {/* Code preview */}
      <div className="mx-4 mb-3 rounded-xl overflow-hidden border border-dracula-card text-xs">
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
      <div className="flex items-center justify-between px-4 pb-4 pt-1">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {snippet.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-dracula-purple/10 text-dracula-purple border border-dracula-purple/20"
            >
              #{tag}
            </span>
          ))}
          {snippet.tags.length > 4 && (
            <span className="text-xs text-dracula-comment">+{snippet.tags.length - 4}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton content={snippet.code} iconSize={14} />
          {snippet.public && (
            <ShareButton snippetId={snippet.id} iconSize={14} />
          )}
          <button
            onClick={() => onEdit(snippet)}
            className="p-1.5 rounded-lg text-dracula-comment hover:text-dracula-purple hover:bg-dracula-purple/10 transition-colors"
            title="Editar"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(snippet)}
            className="p-1.5 rounded-lg text-dracula-comment hover:text-dracula-red hover:bg-dracula-red/10 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
