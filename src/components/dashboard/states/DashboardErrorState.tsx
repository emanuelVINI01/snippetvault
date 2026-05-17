"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";

interface DashboardErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function DashboardErrorState({ error, onRetry }: DashboardErrorStateProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-1 items-center justify-center py-24"
    >
      <div className="text-center">
        <p className="text-sm text-dracula-red">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm text-dracula-purple hover:underline">
          {t.common.tryAgain}
        </button>
      </div>
    </motion.div>
  );
}
