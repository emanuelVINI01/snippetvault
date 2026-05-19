"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";

export default function HomeHeroTitle() {
  const { t } = useLanguage();

  return (
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
      className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-dracula-fg sm:text-6xl lg:text-5xl xl:text-6xl"
    >
      {t.home.titlePrefix}{" "}
      <span className="bg-[linear-gradient(135deg,var(--dracula-purple)_0%,var(--dracula-cyan)_60%,var(--dracula-pink)_100%)] bg-clip-text text-transparent">
        {t.home.titleHighlight}
      </span>{" "}
      {t.home.titleSuffix}
    </motion.h1>
  );
}
