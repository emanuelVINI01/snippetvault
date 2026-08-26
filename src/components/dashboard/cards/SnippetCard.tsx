"use client";

import { motion } from "framer-motion";
import type { Snippet } from "@/src/types/snippet";
import SnippetCardCodePreview from "./SnippetCardCodePreview";
import SnippetCardFooter from "./SnippetCardFooter";
import SnippetCardHeader from "./SnippetCardHeader";

export type { Snippet };

interface SnippetCardProps {
  snippet: Snippet;
  onAi: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  onTogglePin?: (snippet: Snippet) => void;
  onToggleFavorite?: (snippet: Snippet) => void;
}

export default function SnippetCard({
  snippet,
  onAi,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
}: SnippetCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group flex min-w-0 max-w-full flex-col overflow-hidden rounded-xl border border-dracula-card bg-dracula-card/25 transition-colors duration-200 hover:border-dracula-purple/50"
    >
      <SnippetCardHeader
        snippet={snippet}
        onTogglePin={onTogglePin ? () => onTogglePin(snippet) : undefined}
        onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(snippet) : undefined}
      />
      <SnippetCardCodePreview code={snippet.code} language={snippet.language} />
      <SnippetCardFooter snippet={snippet} onAi={onAi} onEdit={onEdit} onDelete={onDelete} />
    </motion.article>
  );
}
