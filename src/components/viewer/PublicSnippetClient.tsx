"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Code2, Tag, User } from "lucide-react";
import Logo from "@/src/components/Logo";
import ShareButton from "@/src/components/ShareButton";
import LanguageToggle from "@/src/components/LanguageToggle";
import CodeViewerClient from "@/src/components/viewer/CodeViewerClient";
import { useLanguage } from "@/src/context/LanguageContext";

export interface PublicSnippetView {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string | null;
  tags: string[];
  public: boolean;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

interface PublicSnippetClientProps {
  snippet: PublicSnippetView;
}

export default function PublicSnippetClient({ snippet }: PublicSnippetClientProps) {
  const { language, t } = useLanguage();
  const formattedDate = new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(snippet.createdAt));

  return (
    <div className="min-h-screen text-dracula-fg">
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

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-sm text-dracula-comment">
            <span className="rounded-full border border-dracula-cyan/20 bg-dracula-cyan/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-dracula-cyan">
              {t.snippetPage.sharedSnippet}
            </span>
            {snippet.user?.name && (
              <span className="flex items-center gap-1.5 rounded-full border border-dracula-card/60 bg-dracula-card/30 px-2.5 py-1 text-dracula-fg">
                <User className="h-3.5 w-3.5" />
                {snippet.user.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-dracula-comment">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-dracula-fg sm:text-4xl">
            {snippet.title}
          </h1>

          {snippet.description && (
            <p className="text-base leading-relaxed text-dracula-comment sm:text-lg">
              {snippet.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-dracula-purple/20 bg-dracula-purple/10 px-3 py-1.5 font-mono text-sm text-dracula-purple">
                <Code2 className="h-4 w-4" />
                {snippet.language}
              </div>
              {snippet.public && (
                <ShareButton
                  snippetId={snippet.id}
                  iconSize={18}
                  className="border border-dracula-card/60 bg-dracula-card/30 p-2"
                />
              )}
            </div>

            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-lg border border-dracula-card bg-dracula-card/30 px-3 py-1.5 text-xs capitalize text-dracula-cyan"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 26, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.42, ease: "easeOut" }}
          className="overflow-hidden rounded-xl border border-dracula-card/70 bg-[#282a36] shadow-2xl shadow-black/20"
        >
          <div className="flex items-center justify-between border-b border-dracula-card/60 bg-[#21222c] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-dracula-red" />
              <span className="h-3 w-3 rounded-full bg-dracula-yellow" />
              <span className="h-3 w-3 rounded-full bg-dracula-green" />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-dracula-comment">
              <Code2 className="h-3.5 w-3.5" /> {snippet.language.toLowerCase()}
            </div>
          </div>

          <CodeViewerClient code={snippet.code} language={snippet.language} />
        </motion.section>
      </main>
    </div>
  );
}
