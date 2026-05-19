"use client";

import { motion } from "framer-motion";
import type { PublicSnippetView } from "@/src/types/public-snippet";
import PublicSnippetActions from "./PublicSnippetActions";
import PublicSnippetMeta from "./PublicSnippetMeta";

interface PublicSnippetHeroProps {
  snippet: PublicSnippetView;
}

export default function PublicSnippetHero({ snippet }: PublicSnippetHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      <PublicSnippetMeta snippet={snippet} />
      <h1 className="text-3xl font-bold leading-tight text-dracula-fg sm:text-4xl">
        {snippet.title}
      </h1>
      {snippet.description && (
        <p className="text-base leading-relaxed text-dracula-comment sm:text-lg">
          {snippet.description}
        </p>
      )}
      <PublicSnippetActions snippet={snippet} />
    </motion.section>
  );
}
