"use client";

import { motion } from "framer-motion";
import { LogIn, Save, Search } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

const STEP_STYLES = [
  { icon: LogIn, iconClass: "text-dracula-purple", glow: "rgba(189,147,249,0.24)" },
  { icon: Save, iconClass: "text-dracula-green", glow: "rgba(80,250,123,0.2)" },
  { icon: Search, iconClass: "text-dracula-cyan", glow: "rgba(139,233,253,0.2)" },
];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-16 text-3xl font-bold text-dracula-fg sm:text-4xl"
        >
          {t.home.flowTitle}
        </motion.h2>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-10 hidden h-px bg-dracula-card/80 md:block">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--dracula-purple),var(--dracula-cyan),var(--dracula-green))] opacity-35" />
          </div>

          {t.home.steps.map((step, index) => {
            const style = STEP_STYLES[index];
            const Icon = style.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
                className="relative flex flex-col items-center"
              >
                <div
                  className="z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-dracula-card bg-dracula-surface shadow-lg shadow-black/20"
                  style={{ boxShadow: `0 18px 52px rgba(0,0,0,0.24), 0 0 32px ${style.glow}` }}
                >
                  <Icon className={`h-5 w-5 ${style.iconClass}`} />
                </div>
                <div className="absolute right-[calc(50%-3rem)] top-0 z-20 -mr-2 -mt-2 flex h-6 w-6 items-center justify-center rounded-full border border-dracula-card bg-dracula-bg font-mono text-xs text-dracula-comment md:right-0">
                  {index + 1}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dracula-fg">{step.title}</h3>
                <p className="px-4 text-sm leading-relaxed text-dracula-comment">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
