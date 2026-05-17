"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LanguageToggle from "@/src/components/LanguageToggle";
import Logo from "@/src/components/Logo";
import { useLanguage } from "@/src/context/LanguageContext";

export default function PublicSnippetHeader() {
  const { t } = useLanguage();

  return (
    <motion.header
      initial={{ y: -42, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-dracula-card/60 bg-dracula-bg/85 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link
            href="/dashboard"
            className="hidden rounded-lg border border-dracula-purple/25 bg-dracula-purple/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-dracula-purple transition-colors hover:border-dracula-purple/50 hover:bg-dracula-purple/15 sm:inline-flex"
          >
            {t.snippetPage.dashboardLink}
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
