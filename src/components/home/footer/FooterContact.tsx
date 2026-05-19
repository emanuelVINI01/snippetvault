"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { siteConfig } from "@/src/lib/site";

export default function FooterContact() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-fg">
        <ShieldCheck className="h-3.5 w-3.5 text-dracula-green" />
        {t.common.contact}
      </div>
      <div className="grid gap-3 text-sm">
        <a
          href={siteConfig.creatorUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-dracula-cyan/20 bg-dracula-cyan/10 px-3 py-2 text-dracula-fg transition-colors hover:border-dracula-cyan/50 hover:text-dracula-cyan"
        >
          <ExternalLink className="h-4 w-4" />
          {t.common.repository}
        </a>
        <span>{t.footer.madeByPrefix} emanuelVINI</span>
      </div>
    </div>
  );
}
