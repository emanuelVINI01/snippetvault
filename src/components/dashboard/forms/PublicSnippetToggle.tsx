"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";

interface PublicSnippetToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function PublicSnippetToggle({ checked, onChange }: PublicSnippetToggleProps) {
  const { t } = useLanguage();

  return (
    <label className="flex cursor-pointer select-none items-center gap-3">
      <motion.div
        layout
        className={`relative h-5.5 w-10 rounded-full transition-colors duration-200 ${checked ? "bg-dracula-purple" : "bg-dracula-card"}`}
        onClick={() => onChange(!checked)}
      >
        <motion.span
          layout
          className={`absolute left-0.5 top-0.5 h-4.5 w-4.5 rounded-full bg-dracula-fg shadow transition-transform duration-200 ${checked ? "translate-x-[18px]" : ""}`}
        />
      </motion.div>
      <span className="text-sm text-dracula-comment">{t.form.publicSnippet}</span>
    </label>
  );
}
