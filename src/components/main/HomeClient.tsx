"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Lock, Search, Tag, Zap, Globe2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Logo from "@/src/components/Logo";
import LanguageToggle from "@/src/components/LanguageToggle";
import { useLanguage } from "@/src/context/LanguageContext";
import Features from "@/src/components/main/Features";
import HowItWorks from "@/src/components/main/HowItWorks";
import CodePreview from "@/src/components/main/CodePreview";
import FAQ from "@/src/components/main/FAQ";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "text-dracula-cyan bg-dracula-cyan/10 border-dracula-cyan/30",
  Python: "text-dracula-green bg-dracula-green/10 border-dracula-green/30",
  SQL: "text-dracula-purple bg-dracula-purple/10 border-dracula-purple/30",
  Bash: "text-dracula-comment bg-dracula-comment/10 border-dracula-comment/30",
  CSS: "text-dracula-red bg-dracula-red/10 border-dracula-red/30",
  Go: "text-dracula-cyan bg-dracula-cyan/10 border-dracula-cyan/30",
};

interface HomeClientProps {
  isAuthenticated: boolean;
}

export default function HomeClient({ isAuthenticated }: HomeClientProps) {
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
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-dracula-purple/30 bg-dracula-purple/15 px-3 text-xs font-semibold uppercase tracking-widest text-dracula-purple transition-colors hover:border-dracula-purple/60 hover:bg-dracula-purple/25 sm:px-4"
            >
              {isAuthenticated ? <LayoutDashboard className="h-3.5 w-3.5" /> : <FaGithub className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isAuthenticated ? t.common.dashboard : t.common.login}</span>
            </Link>
          </div>
        </div>
      </motion.nav>

      <main>
        <section className="mx-auto flex min-h-[92vh] max-w-6xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6 sm:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-dracula-purple/25 bg-dracula-purple/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-dracula-purple"
          >
            <Zap className="h-3 w-3" />
            {t.home.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
            className="max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-dracula-fg sm:text-6xl lg:text-7xl"
          >
            {t.home.titlePrefix}{" "}
            <span className="bg-[linear-gradient(135deg,var(--dracula-purple)_0%,var(--dracula-cyan)_60%,var(--dracula-pink)_100%)] bg-clip-text text-transparent">
              {t.home.titleHighlight}
            </span>{" "}
            {t.home.titleSuffix}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.5, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-dracula-comment sm:text-lg"
          >
            {t.home.subtitle}
          </motion.p>

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
              {isAuthenticated ? (
                <LayoutDashboard className="h-5 w-5 transition-transform group-hover:rotate-12" />
              ) : (
                <FaGithub className="h-5 w-5 transition-transform group-hover:rotate-12" />
              )}
              {isAuthenticated ? t.home.ctaDashboard : t.home.ctaLogin}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-dracula-comment sm:gap-5 sm:text-sm"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-dracula-green" />
              {t.home.trustAuth}
            </span>
            <span className="hidden h-4 w-px bg-dracula-card sm:block" />
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-dracula-cyan" />
              {t.home.trustSearch}
            </span>
            <span className="hidden h-4 w-px bg-dracula-card sm:block" />
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-dracula-purple" />
              {t.home.trustData}
            </span>
          </motion.div>
        </section>

        <section className="px-4 pb-28 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-dracula-card/70 bg-dracula-surface/70 shadow-2xl shadow-black/40 backdrop-blur"
          >
            <div className="flex items-center gap-2 border-b border-dracula-card/60 bg-dracula-card/70 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-dracula-red/80" />
              <span className="h-3 w-3 rounded-full bg-dracula-green/60" />
              <span className="h-3 w-3 rounded-full bg-dracula-comment/50" />
              <div className="mx-2 flex h-6 min-w-0 flex-1 items-center rounded-md border border-dracula-card bg-dracula-bg/60 px-3 sm:mx-4">
                <span className="truncate text-[10px] text-dracula-comment sm:text-xs">
                  snippetvault.emanuelvini.dev/dashboard
                </span>
              </div>
            </div>

            <div className="bg-dracula-bg/82 p-4 sm:p-5">
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-dracula-card bg-dracula-card/50 px-4 py-3 text-sm text-dracula-comment">
                <Search className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{t.home.mockSearch}</span>
                <span className="rounded border border-dracula-comment/30 px-2 py-0.5 font-mono text-[10px]">⌘ K</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {t.home.mockSnippets.map((snippet, index) => (
                  <motion.div
                    key={snippet.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.045, duration: 0.28 }}
                    className="group cursor-default rounded-xl border border-dracula-card bg-dracula-card/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-dracula-purple/40 hover:shadow-lg hover:shadow-dracula-purple/10"
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <span className="min-w-0 text-sm font-semibold leading-tight text-dracula-fg">
                        {snippet.title}
                      </span>
                      <span className={`shrink-0 rounded border px-2 py-0.5 font-mono text-xs ${LANG_COLORS[snippet.lang] ?? "border-dracula-card text-dracula-comment"}`}>
                        {snippet.lang}
                      </span>
                    </div>
                    <div className="mb-3 space-y-1.5">
                      {[70, 90, 55].map((width, lineIndex) => (
                        <div
                          key={lineIndex}
                          className="h-2 rounded-full bg-dracula-comment/20"
                          style={{ width: `${width}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {snippet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-dracula-purple/20 bg-dracula-purple/10 px-2 py-0.5 text-xs text-dracula-purple"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <p className="mt-4 text-center text-xs tracking-wide text-dracula-comment">{t.home.mockCaption}</p>
        </section>

        <Features />
        <HowItWorks />
        <CodePreview />
        <FAQ />
      </main>
    </div>
  );
}
