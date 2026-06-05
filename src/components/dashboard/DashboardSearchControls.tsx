"use client";

import { motion } from "framer-motion";
import { Globe, Sparkles } from "lucide-react";
import type { RefObject } from "react";
import SearchBar from "@/src/components/shared/navigation/SearchBar";
import { useLanguage } from "@/src/context/LanguageContext";

interface DashboardSearchControlsProps {
  isGlobal: boolean;
  semantic: boolean;
  query: string;
  searchRef: RefObject<HTMLDivElement | null>;
  onQueryChange: (query: string) => void;
  onToggleGlobal: () => void;
  onToggleSemantic: () => void;
}

export default function DashboardSearchControls({
  isGlobal,
  semantic,
  onQueryChange,
  onToggleGlobal,
  onToggleSemantic,
  query,
  searchRef,
}: DashboardSearchControlsProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.35, ease: "easeOut" }}
      className="flex min-w-0 flex-col items-center gap-4 sm:flex-row w-full"
      ref={searchRef}
    >
      <div className="relative w-full min-w-0 flex-1">
        <SearchBar value={query} onChange={onQueryChange} />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={onToggleGlobal}
          className={`flex-1 sm:flex-initial flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${getToggleClass(isGlobal)}`}
          title={t.dashboard.globalSearch}
        >
          <Globe className="h-5 w-5" />
          <span className="hidden sm:inline">{t.dashboard.globalSearch}</span>
        </button>
        {isGlobal && (
          <button
            onClick={onToggleSemantic}
            className={`flex-1 sm:flex-initial flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${getSemanticToggleClass(semantic)}`}
            title={t.dashboard.semanticSearch}
          >
            <Sparkles className="h-5 w-5" />
            <span className="hidden sm:inline">{t.dashboard.semanticSearch}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function getToggleClass(isGlobal: boolean): string {
  if (isGlobal) {
    return "border-dracula-purple bg-dracula-purple/10 text-dracula-purple shadow-sm shadow-dracula-purple/20";
  }

  return "border-dracula-card bg-dracula-card/30 text-dracula-comment hover:border-dracula-comment/50 hover:text-dracula-fg";
}

function getSemanticToggleClass(semantic: boolean): string {
  if (semantic) {
    return "border-dracula-cyan bg-dracula-cyan/10 text-dracula-cyan shadow-sm shadow-dracula-cyan/20";
  }

  return "border-dracula-card bg-dracula-card/30 text-dracula-comment hover:border-dracula-comment/50 hover:text-dracula-fg";
}
