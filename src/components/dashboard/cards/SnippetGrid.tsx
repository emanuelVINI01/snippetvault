"use client";

import { motion } from "framer-motion";
import type { Snippet } from "@/src/types/snippet";
import SnippetCard from "./SnippetCard";

interface SnippetGridProps {
  snippets: Snippet[];
  onAi: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
}

export default function SnippetGrid({ onAi, onDelete, onEdit, snippets }: SnippetGridProps) {
  return (
    <motion.div
      key="grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {snippets.map((snippet) => (
        <SnippetCard key={snippet.id} snippet={snippet} onAi={onAi} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </motion.div>
  );
}
