"use client";

import { motion } from "framer-motion";
import { Bot, Boxes, Code2 } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

export type DashboardView = "snippets" | "collections" | "usage";

interface DashboardTabsProps {
  value: DashboardView;
  onChange: (view: DashboardView) => void;
}

export default function DashboardTabs({ onChange, value }: DashboardTabsProps) {
  const { t } = useLanguage();
  const tabs = [
    { icon: Code2, label: t.dashboard.tabs.snippets, value: "snippets" as const },
    { icon: Boxes, label: t.dashboard.tabs.collections, value: "collections" as const },
    { icon: Bot, label: t.dashboard.tabs.usage, value: "usage" as const },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-dracula-card/70 bg-dracula-card/20 p-1.5">
      {tabs.map(({ icon: Icon, label, value: tabValue }) => {
        const active = value === tabValue;

        return (
          <button
            key={tabValue}
            onClick={() => onChange(tabValue)}
            className={`relative min-w-0 rounded-xl px-2 py-3 text-xs font-semibold transition-colors sm:text-sm ${
              active ? "text-dracula-fg" : "text-dracula-comment hover:text-dracula-cyan"
            }`}
          >
            {active && (
              <motion.span
                layoutId="dashboard-view-pill"
                className="absolute inset-0 rounded-xl border border-dracula-purple/35 bg-dracula-surface"
                transition={{ type: "spring", stiffness: 430, damping: 36 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="truncate">{label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
