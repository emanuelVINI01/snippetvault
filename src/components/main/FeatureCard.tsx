"use client";

import { motion } from "framer-motion";
import { FEATURE_STYLES } from "./feature-styles";

interface FeatureCardProps {
  description: string;
  index: number;
  title: string;
}

export default function FeatureCard({ description, index, title }: FeatureCardProps) {
  const style = FEATURE_STYLES[index];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay: index * 0.055, duration: 0.35, ease: "easeOut" }}
      className={`group rounded-2xl border border-dracula-card/80 bg-dracula-surface/55 p-6 shadow-lg shadow-black/10 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-dracula-purple/10 ${style.borderClass}`}
    >
      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${style.bgClass}`}>
        <Icon className={`h-6 w-6 ${style.iconClass}`} />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-dracula-fg">{title}</h3>
      <p className="text-sm leading-relaxed text-dracula-comment">{description}</p>
    </motion.div>
  );
}
