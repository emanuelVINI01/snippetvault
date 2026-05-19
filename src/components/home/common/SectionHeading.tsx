"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
  subtitle?: string;
}

export default function SectionHeading({
  children,
  className = "mb-16 text-center",
  subtitle,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
    >
      <h2 className="text-3xl font-bold text-dracula-fg sm:text-4xl">{children}</h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-dracula-comment sm:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
