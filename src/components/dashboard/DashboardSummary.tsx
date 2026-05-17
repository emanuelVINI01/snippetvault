"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface DashboardSummaryProps {
  loading: boolean;
  snippetCount: number;
  visibleCount: number;
  onCreate: () => void;
}

export default function DashboardSummary({
  loading,
  onCreate,
  snippetCount,
  visibleCount,
}: DashboardSummaryProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06, duration: 0.35, ease: "easeOut" }}
      className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div>
        <h1 className="text-2xl font-bold text-dracula-fg">{t.dashboard.title}</h1>
        {!loading && (
          <p className="mt-1 text-sm text-dracula-comment">
            {getSummaryText(snippetCount, visibleCount, t.dashboard)}
          </p>
        )}
      </div>

      <button
        onClick={onCreate}
        className="flex min-w-0 items-center gap-2 rounded-xl bg-dracula-purple px-4 py-2.5 text-sm font-semibold text-dracula-bg shadow-lg shadow-dracula-purple/20 transition-all duration-150 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:self-auto"
      >
        <Plus className="h-4 w-4" />
        {t.dashboard.newSnippet}
      </button>
    </motion.div>
  );
}

type DashboardCopy = {
  emptyInline: string;
  snippetPlural: string;
  snippetSingular: string;
  visible: string;
  visiblePlural: string;
};

function getSummaryText(snippetCount: number, visibleCount: number, copy: DashboardCopy): string {
  if (snippetCount === 0) return copy.emptyInline;

  return `${snippetCount} ${pluralize(snippetCount, copy.snippetSingular, copy.snippetPlural)} · ${visibleCount} ${pluralize(visibleCount, copy.visible, copy.visiblePlural)}`;
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}
