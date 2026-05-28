"use client";

import { motion } from "framer-motion";
import { BookOpen, Bot, Bug, DatabaseZap, FileText, Sparkles, Tags, Wand2 } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import SectionHeading from "../common/SectionHeading";

const cardIcons = [Bot, FileText, Tags, Bug, Wand2, BookOpen, DatabaseZap, Sparkles];

export default function Intelligence() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-y border-dracula-card/30 bg-dracula-card/10 px-4 py-24 sm:px-6">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 rounded-full border border-dracula-purple/25"
        animate={{ y: [0, -12, 0], rotate: [0, 18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-8 top-24 hidden rounded-2xl border border-dracula-cyan/25 bg-dracula-bg/60 px-4 py-3 text-xs text-dracula-cyan shadow-2xl shadow-dracula-cyan/10 md:block"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        cache hit · no API call
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 left-8 hidden rounded-2xl border border-dracula-pink/25 bg-dracula-bg/60 px-4 py-3 text-xs text-dracula-pink shadow-2xl shadow-dracula-pink/10 md:block"
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        Gemini · one request
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading subtitle={t.home.intelligenceSubtitle}>
          {t.home.intelligenceTitlePrefix}{" "}
          <span className="text-dracula-pink">{t.home.intelligenceTitleHighlight}</span>
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {t.home.intelligenceCards.map((card, index) => {
            const Icon = cardIcons[index] ?? Sparkles;

            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="relative min-h-48 overflow-hidden rounded-2xl border border-dracula-card/80 bg-dracula-surface/55 p-5 shadow-xl shadow-black/10 backdrop-blur"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute right-4 top-4 h-10 w-10 rounded-full border border-dracula-purple/20"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.7, 0.35] }}
                  transition={{ duration: 2.6 + index * 0.15, repeat: Infinity }}
                />
                <div className="relative z-10 mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-dracula-purple/25 bg-dracula-purple/10 text-dracula-purple">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative z-10 text-lg font-bold text-dracula-fg">{card.title}</h3>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-dracula-comment">
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="overflow-hidden rounded-2xl border border-dracula-purple/30 bg-[#282a36] shadow-2xl shadow-black/30"
          >
            <div className="flex items-center justify-between border-b border-dracula-card/60 bg-[#21222c] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-dracula-red" />
                <span className="h-3 w-3 rounded-full bg-dracula-yellow" />
                <span className="h-3 w-3 rounded-full bg-dracula-green" />
              </div>
              <div className="flex items-center gap-2 text-xs text-dracula-comment">
                <Sparkles className="h-3.5 w-3.5 text-dracula-pink" />
                AI assistant
              </div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {t.home.aiPills.map((pill) => (
                <div
                  key={pill}
                  className="rounded-xl border border-dracula-card/70 bg-dracula-bg/45 px-3 py-3 text-sm text-dracula-comment"
                >
                  {pill}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="rounded-2xl border border-dracula-cyan/25 bg-dracula-surface/55 p-5"
          >
            <BookOpen className="mb-4 h-6 w-6 text-dracula-cyan" />
            <h3 className="text-xl font-bold text-dracula-fg">{t.home.collectionsSpotlightTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-dracula-comment">
              {t.home.collectionsSpotlightDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {t.home.collectionExamples.map((example) => (
                <span
                  key={example}
                  className="rounded-full border border-dracula-cyan/20 bg-dracula-cyan/10 px-3 py-1 text-xs text-dracula-cyan"
                >
                  {example}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
