"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";

interface HomeHeroCtaProps {
  isAuthenticated: boolean;
}

export default function HomeHeroCta({ isAuthenticated }: HomeHeroCtaProps) {
  const { t } = useLanguage();
  const Icon = isAuthenticated ? LayoutDashboard : LogIn;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.24, duration: 0.5, ease: "easeOut" }}
      className="mt-10"
    >
      <Link
        href={isAuthenticated ? "/dashboard" : "/login"}
        className="group inline-flex items-center gap-3 rounded-xl bg-dracula-purple px-6 py-3.5 text-sm font-bold text-dracula-bg shadow-lg shadow-dracula-purple/25 transition-all duration-200 hover:scale-[1.03] hover:shadow-dracula-purple/40 active:scale-[0.98] sm:px-8 sm:text-base"
      >
        <Icon className="h-5 w-5 transition-transform group-hover:rotate-12" />
        {isAuthenticated ? t.home.ctaDashboard : t.home.ctaLogin}
      </Link>
    </motion.div>
  );
}
