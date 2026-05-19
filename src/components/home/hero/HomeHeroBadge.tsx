"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface HomeHeroBadgeProps {
  label: string;
}

export default function HomeHeroBadge({ label }: HomeHeroBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="mb-8 inline-flex items-center gap-2 rounded-full border border-dracula-purple/25 bg-dracula-purple/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-dracula-purple"
    >
      <Zap className="h-3 w-3" />
      {label}
    </motion.div>
  );
}
