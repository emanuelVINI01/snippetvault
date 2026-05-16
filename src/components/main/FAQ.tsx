"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-12 text-center text-3xl font-bold text-dracula-fg sm:text-4xl"
        >
          {t.home.faqTitle}
        </motion.h2>

        <div className="space-y-4">
          {t.home.faqs.map((faq, index) => {
            const isOpen = openIdx === index;

            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.045, duration: 0.28 }}
                className={`overflow-hidden rounded-xl border transition-colors duration-200 ${
                  isOpen
                    ? "border-dracula-purple/30 bg-dracula-surface/70"
                    : "border-dracula-card/60 bg-dracula-bg/55 hover:border-dracula-card"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left outline-none"
                >
                  <span className="font-medium text-dracula-fg">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-dracula-comment transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-dracula-purple" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-dracula-comment">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
