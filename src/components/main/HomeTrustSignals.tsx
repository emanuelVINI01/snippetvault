"use client";

import { motion } from "framer-motion";
import { Globe2, Lock, Tag } from "lucide-react";
import type { ReactNode } from "react";
import { useLanguage } from "@/src/context/LanguageContext";

export default function HomeTrustSignals() {
  const { t } = useLanguage();
  const signals = [
    { icon: <Lock className="h-3.5 w-3.5 text-dracula-green" />, label: t.home.trustAuth },
    { icon: <Globe2 className="h-3.5 w-3.5 text-dracula-cyan" />, label: t.home.trustSearch },
    { icon: <Tag className="h-3.5 w-3.5 text-dracula-purple" />, label: t.home.trustData },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.32, duration: 0.5 }}
      className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-dracula-comment sm:gap-5 sm:text-sm"
    >
      {signals.map((signal, index) => (
        <TrustSignal key={signal.label} icon={signal.icon} label={signal.label} showDivider={index > 0} />
      ))}
    </motion.div>
  );
}

function TrustSignal({
  icon,
  label,
  showDivider,
}: {
  icon: ReactNode;
  label: string;
  showDivider: boolean;
}) {
  return (
    <>
      {showDivider && <span className="hidden h-4 w-px bg-dracula-card sm:block" />}
      <span className="flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </>
  );
}
