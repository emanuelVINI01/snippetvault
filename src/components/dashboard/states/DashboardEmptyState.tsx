"use client";

import { motion } from "framer-motion";
import { Package, Plus } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface DashboardEmptyStateProps {
  onCreate: () => void;
}

export default function DashboardEmptyState({ onCreate }: DashboardEmptyStateProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-1 flex-col items-center justify-center gap-5 py-24 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dracula-card bg-dracula-card/50">
        <Package className="h-8 w-8 text-dracula-comment" />
      </div>
      <div>
        <p className="font-medium text-dracula-fg">{t.dashboard.emptyTitle}</p>
        <p className="mt-1 text-sm text-dracula-comment">{t.dashboard.emptyDescription}</p>
      </div>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 rounded-xl border border-dracula-purple/30 bg-dracula-purple/15 px-5 py-2.5 text-sm font-medium text-dracula-purple transition-colors hover:bg-dracula-purple/25"
      >
        <Plus className="h-4 w-4" />
        {t.dashboard.createFirst}
      </button>
    </motion.div>
  );
}
