"use client";

import { motion } from "framer-motion";
import { Code2, Globe2, Lock, Search, Tag, Zap } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

const FEATURE_STYLES = [
  {
    icon: Search,
    iconClass: "text-dracula-cyan",
    bgClass: "bg-dracula-cyan/10",
    borderClass: "group-hover:border-dracula-cyan/50",
  },
  {
    icon: Tag,
    iconClass: "text-dracula-purple",
    bgClass: "bg-dracula-purple/10",
    borderClass: "group-hover:border-dracula-purple/50",
  },
  {
    icon: Code2,
    iconClass: "text-dracula-green",
    bgClass: "bg-dracula-green/10",
    borderClass: "group-hover:border-dracula-green/50",
  },
  {
    icon: Lock,
    iconClass: "text-dracula-red",
    bgClass: "bg-dracula-red/10",
    borderClass: "group-hover:border-dracula-red/50",
  },
  {
    icon: Globe2,
    iconClass: "text-dracula-orange",
    bgClass: "bg-dracula-orange/10",
    borderClass: "group-hover:border-dracula-orange/50",
  },
  {
    icon: Zap,
    iconClass: "text-dracula-yellow",
    bgClass: "bg-dracula-yellow/10",
    borderClass: "group-hover:border-dracula-yellow/50",
  },
];

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-dracula-fg sm:text-4xl">
            {t.home.featuresTitlePrefix}{" "}
            <span className="text-dracula-purple">{t.home.featuresTitleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-dracula-comment sm:text-base">
            {t.home.featuresSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.home.features.map((feature, index) => {
            const style = FEATURE_STYLES[index];
            const Icon = style.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ delay: index * 0.055, duration: 0.35, ease: "easeOut" }}
                className={`group rounded-2xl border border-dracula-card/80 bg-dracula-surface/55 p-6 shadow-lg shadow-black/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-dracula-purple/10 ${style.borderClass}`}
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${style.bgClass}`}>
                  <Icon className={`h-6 w-6 ${style.iconClass}`} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-dracula-fg">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-dracula-comment">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
