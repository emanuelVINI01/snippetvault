"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative"
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dracula-comment pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.dashboard.searchPlaceholder}
        className="w-full pl-11 pr-20 py-3 rounded-2xl border border-dracula-card bg-dracula-card/30 text-dracula-fg text-sm placeholder:text-dracula-comment/60 outline-none focus:border-dracula-purple focus:ring-2 focus:ring-dracula-purple/20 transition-all duration-200"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-dracula-comment/30 text-dracula-comment bg-dracula-card/50">⌘</kbd>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-dracula-comment/30 text-dracula-comment bg-dracula-card/50">K</kbd>
      </span>
    </motion.div>
  );
}
