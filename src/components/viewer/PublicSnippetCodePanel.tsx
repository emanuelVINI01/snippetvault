"use client";

import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import CodeViewerClient from "@/src/components/viewer/CodeViewerClient";
import type { PublicSnippetView } from "@/src/types/public-snippet";

interface PublicSnippetCodePanelProps {
  snippet: PublicSnippetView;
}

export default function PublicSnippetCodePanel({ snippet }: PublicSnippetCodePanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 26, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.12, duration: 0.42, ease: "easeOut" }}
      className="overflow-hidden rounded-xl border border-dracula-card/70 bg-[#282a36] shadow-2xl shadow-black/20"
    >
      <div className="flex items-center justify-between border-b border-dracula-card/60 bg-[#21222c] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-dracula-red" />
          <span className="h-3 w-3 rounded-full bg-dracula-yellow" />
          <span className="h-3 w-3 rounded-full bg-dracula-green" />
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-dracula-comment">
          <Code2 className="h-3.5 w-3.5" />
          {snippet.language.toLowerCase()}
        </div>
      </div>
      <CodeViewerClient code={snippet.code} language={snippet.language} />
    </motion.section>
  );
}
