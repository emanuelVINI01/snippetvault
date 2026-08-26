"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";
import Flag, { FLAGS, type LocaleCode } from "./Flag";

const LOCALES: LocaleCode[] = ["pt", "en"];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className="inline-flex h-9 items-center gap-1 rounded-lg border border-dracula-card bg-dracula-card/30 p-1"
      role="group"
      aria-label={t.common.toggleLanguage}
    >
      {LOCALES.map((locale) => {
        const active = language === locale;

        return (
          <motion.button
            key={locale}
            type="button"
            onClick={() => setLanguage(locale)}
            whileTap={{ scale: 0.92 }}
            className={`flex h-full items-center justify-center rounded-md px-1.5 transition-all duration-150 ${
              active
                ? "bg-dracula-purple/20 ring-1 ring-dracula-purple/50"
                : "opacity-45 hover:opacity-90"
            }`}
            title={FLAGS[locale].label}
            aria-label={FLAGS[locale].label}
            aria-pressed={active}
          >
            <Flag locale={locale} size={16} />
          </motion.button>
        );
      })}
    </div>
  );
}
