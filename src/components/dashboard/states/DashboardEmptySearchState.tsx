"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";

interface DashboardEmptySearchStateProps {
  onClearSearch: () => void;
  query: string;
}

export default function DashboardEmptySearchState({
  onClearSearch,
  query,
}: DashboardEmptySearchStateProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      key="empty-search"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="py-16 text-center"
    >
      <p className="text-dracula-comment">
        {t.dashboard.noResults} <span className="text-dracula-fg">&quot;{query}&quot;</span>
      </p>
      <button onClick={onClearSearch} className="mt-2 text-sm text-dracula-purple hover:underline">
        {t.common.clearSearch}
      </button>
    </motion.div>
  );
}
