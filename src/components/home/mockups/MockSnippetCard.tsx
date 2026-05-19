"use client";

import { motion } from "framer-motion";
import { getMockLanguageClass } from "@/src/utils/home/mock-snippets";

export type MockSnippet = {
  lang: string;
  tags: string[];
  title: string;
};

interface MockSnippetCardProps {
  index: number;
  snippet: MockSnippet;
}

export default function MockSnippetCard({ index, snippet }: MockSnippetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.045, duration: 0.28 }}
      className="group min-w-0 cursor-default rounded-lg border border-dracula-card bg-dracula-card/30 p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-dracula-purple/40 hover:shadow-lg hover:shadow-dracula-purple/10 sm:rounded-xl sm:p-4"
    >
      <MockSnippetHeader snippet={snippet} />
      <MockCodeLines />
      <MockSnippetTags tags={snippet.tags} />
    </motion.div>
  );
}

function MockSnippetHeader({ snippet }: { snippet: MockSnippet }) {
  return (
    <div className="mb-2 flex min-w-0 flex-col gap-1 sm:mb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
      <span className="line-clamp-2 min-w-0 text-[10px] font-semibold leading-tight text-dracula-fg sm:text-sm">
        {snippet.title}
      </span>
      <span className={`w-fit max-w-full truncate rounded border px-1.5 py-0.5 font-mono text-[8px] sm:shrink-0 sm:px-2 sm:text-xs ${getMockLanguageClass(snippet.lang)}`}>
        {snippet.lang}
      </span>
    </div>
  );
}

function MockSnippetTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="max-w-full truncate rounded-full border border-dracula-purple/20 bg-dracula-purple/10 px-1.5 py-0.5 text-[8px] text-dracula-purple sm:px-2 sm:text-xs"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

function MockCodeLines() {
  return (
    <div className="mb-2 space-y-1 sm:mb-3 sm:space-y-1.5">
      {[70, 90, 55].map((width) => (
        <div key={width} className="h-1.5 rounded-full bg-dracula-comment/20 sm:h-2" style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}
