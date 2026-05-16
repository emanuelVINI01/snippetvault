"use client";

import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Logo from "@/src/components/Logo";
import LanguageToggle from "@/src/components/LanguageToggle";
import { useLanguage } from "@/src/context/LanguageContext";

interface LoginClientProps {
  signInAction: () => Promise<void>;
}

export default function LoginClient({ signInAction }: LoginClientProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen text-dracula-fg">
      <motion.nav
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 border-b border-dracula-card/40 bg-dracula-bg/75 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <LanguageToggle />
        </div>
      </motion.nav>

      <main className="flex min-h-screen items-center justify-center px-4 py-28">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="w-full max-w-sm rounded-2xl border border-dracula-card/70 bg-dracula-surface/80 p-8 shadow-2xl shadow-black/35 backdrop-blur"
        >
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dracula-purple/35 bg-dracula-purple/10 shadow-[0_0_30px_rgba(189,147,249,0.18)]">
              <LockKeyhole className="h-6 w-6 text-dracula-purple" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex rounded-full border border-dracula-cyan/20 bg-dracula-cyan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-dracula-cyan">
              {t.login.badge}
            </div>
            <h1 className="text-2xl font-bold text-dracula-fg">{t.login.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-dracula-comment">{t.login.subtitle}</p>
          </div>

          <form action={signInAction}>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-dracula-card bg-dracula-card/65 px-4 py-3 text-sm font-semibold text-dracula-fg transition-all duration-200 hover:border-dracula-purple/50 hover:bg-dracula-purple/15 hover:text-dracula-purple"
            >
              <FaGithub className="h-5 w-5" />
              {t.login.github}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
