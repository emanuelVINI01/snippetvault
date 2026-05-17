"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";

export default function DashboardLoadingState() {
  const { t } = useLanguage();

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-1 items-center justify-center py-24"
    >
      <div className="flex flex-col items-center gap-3 text-dracula-comment">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-dracula-purple/30 border-t-dracula-purple" />
        <span className="text-sm">{t.dashboard.loadingSnippets}</span>
      </div>
    </motion.div>
  );
}
