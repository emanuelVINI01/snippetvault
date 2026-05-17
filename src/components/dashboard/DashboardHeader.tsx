"use client";

import { motion } from "framer-motion";
import { LogOut, RefreshCw } from "lucide-react";
import LanguageToggle from "@/src/components/LanguageToggle";
import Logo from "@/src/components/Logo";
import { useLanguage } from "@/src/context/LanguageContext";

interface DashboardHeaderProps {
  onRefresh: () => void;
}

export default function DashboardHeader({ onRefresh }: DashboardHeaderProps) {
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
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={onRefresh}
            className="rounded-lg p-2 text-dracula-comment transition-colors hover:bg-dracula-card hover:text-dracula-fg"
            title={t.dashboard.updateTitle}
            aria-label={t.dashboard.updateTitle}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-dracula-comment transition-colors hover:bg-dracula-red/8 hover:text-dracula-red"
            title={t.dashboard.logoutTitle}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t.common.logout}</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function signOut() {
  window.location.href = "/api/auth/signout";
}
