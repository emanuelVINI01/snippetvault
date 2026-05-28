"use client";

import { motion } from "framer-motion";
import { Bot, DatabaseZap, RefreshCw, ShieldCheck } from "lucide-react";
import { useAiUsage } from "@/src/hooks/ai/use-ai-usage";
import { useLanguage } from "@/src/context/LanguageContext";

export default function AiUsagePanel() {
  const { loading, refreshUsage, usage } = useAiUsage();
  const { t } = useLanguage();
  const percent = usage ? Math.min((usage.used / usage.limit) * 100, 100) : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-dracula-purple/25 bg-dracula-card/20"
    >
      <div className="relative p-5 sm:p-6">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dracula-cyan to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
        />
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-dracula-cyan/25 bg-dracula-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-dracula-cyan">
              <Bot className="h-3.5 w-3.5" />
              {t.ai.usageBadge}
            </span>
            <h2 className="mt-4 text-2xl font-bold text-dracula-fg">{t.ai.usageTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-dracula-comment">
              {t.ai.usageDescription}
            </p>
          </div>
          <button
            onClick={refreshUsage}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-dracula-card bg-dracula-bg/55 px-4 py-2.5 text-sm text-dracula-comment transition-colors hover:text-dracula-fg"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t.common.refresh}
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <UsageMetric icon={ShieldCheck} label={t.ai.realCalls} value={usage ? `${usage.used}/${usage.limit}` : "..."} />
          <UsageMetric icon={DatabaseZap} label={t.ai.cacheHits} value={usage ? String(usage.cacheHits) : "..."} />
          <UsageMetric icon={Bot} label={t.ai.remaining} value={usage ? String(usage.remaining) : "..."} />
        </div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-dracula-bg">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-dracula-cyan via-dracula-purple to-dracula-pink"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </motion.section>
  );
}

function UsageMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bot;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-dracula-card/70 bg-dracula-bg/45 p-4">
      <Icon className="mb-3 h-5 w-5 text-dracula-purple" />
      <p className="text-xs uppercase tracking-widest text-dracula-comment">{label}</p>
      <p className="mt-1 text-2xl font-bold text-dracula-fg">{value}</p>
    </div>
  );
}
