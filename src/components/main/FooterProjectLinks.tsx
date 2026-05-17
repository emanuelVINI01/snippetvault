"use client";

import { ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";
import { siteConfig } from "@/src/lib/site";

export default function FooterProjectLinks() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-fg">
        <Sparkles className="h-3.5 w-3.5 text-dracula-cyan" />
        {t.common.project}
      </div>
      <div className="grid gap-2 text-sm">
        <Link href="/" className="transition-colors hover:text-dracula-cyan">
          {t.common.appName}
        </Link>
        <Link href="/dashboard" className="transition-colors hover:text-dracula-cyan">
          {t.common.dashboard}
        </Link>
        <a
          href={siteConfig.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-dracula-cyan"
        >
          {t.common.website}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
