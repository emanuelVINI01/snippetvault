"use client";

import Link from "next/link";
import { ExternalLink, Keyboard, ShieldCheck, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 w-full border-t border-dracula-card/70 bg-dracula-bg text-dracula-comment">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-32 pt-10 sm:gap-10 sm:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 text-dracula-fg">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-dracula-purple/40 bg-dracula-purple/10 shadow-[0_0_22px_rgba(189,147,249,0.18)]">
                <Keyboard className="h-5 w-5 text-dracula-purple" />
              </span>
              <span className="font-semibold tracking-tight">{t.common.appName}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">{t.footer.description}</p>
          </div>

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
                href="https://snippetvault.emanuelvini.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1.5 transition-colors hover:text-dracula-cyan"
              >
                {t.common.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dracula-fg">
              <ShieldCheck className="h-3.5 w-3.5 text-dracula-green" />
              {t.common.contact}
            </div>
            <div className="grid gap-3 text-sm">
              <a
                href="https://github.com/emanuelVINI01/snippetvault"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-dracula-cyan/20 bg-dracula-cyan/10 px-3 py-2 text-dracula-fg transition-colors hover:border-dracula-cyan/50 hover:text-dracula-cyan"
              >
                <FaGithub className="h-4 w-4" />
                {t.common.repository}
              </a>
              <span>{t.footer.madeByPrefix} emanuelVINI</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-dracula-card/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {t.common.appName}. {t.common.allRightsReserved}
          </p>
          <p className="text-dracula-comment/80">{t.footer.version}</p>
        </div>
      </div>
    </footer>
  );
}
