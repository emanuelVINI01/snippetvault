"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/src/context/LanguageContext";
import MockBrowserChrome from "./MockBrowserChrome";
import MockSearchPreview from "./MockSearchPreview";
import MockSnippetCard from "./MockSnippetCard";

const MOBILE_TOP_SNIPPETS = 6;

export default function SnippetBrowserMockup() {
  const { t } = useLanguage();
  const topSnippets = t.home.mockSnippets.slice(0, MOBILE_TOP_SNIPPETS);

  return (
    <section className="w-full pb-20 lg:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-dracula-card/70 bg-dracula-surface/70 shadow-2xl shadow-black/40 backdrop-blur"
      >
        <MockBrowserChrome />
        <div className="bg-dracula-bg/82 p-4 sm:p-5">
          <MockSearchPreview label={t.home.mockSearch} />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {topSnippets.map((snippet, index) => (
              <MockSnippetCard key={snippet.title} index={index} snippet={snippet} />
            ))}
          </div>
        </div>
      </motion.div>
      <p className="mt-4 text-center text-xs tracking-wide text-dracula-comment">{t.home.mockCaption}</p>
    </section>
  );
}
