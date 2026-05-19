"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import LanguageToggle from "@/src/components/shared/i18n/LanguageToggle";
import Logo from "@/src/components/shared/brand/Logo";
import { useLanguage } from "@/src/context/LanguageContext";

interface HomeNavProps {
  isAuthenticated: boolean;
}

export default function HomeNav({ isAuthenticated }: HomeNavProps) {
  const { t } = useLanguage();
  const href = isAuthenticated ? "/dashboard" : "/login";
  const label = isAuthenticated ? t.common.dashboard : t.common.login;
  const Icon = isAuthenticated ? LayoutDashboard : LogIn;

  return (
    <motion.nav
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-dracula-card/40 bg-dracula-bg/75 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link
            href={href}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-dracula-purple/30 bg-dracula-purple/15 px-3 text-xs font-semibold uppercase tracking-widest text-dracula-purple transition-colors hover:border-dracula-purple/60 hover:bg-dracula-purple/25 sm:px-4"
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
