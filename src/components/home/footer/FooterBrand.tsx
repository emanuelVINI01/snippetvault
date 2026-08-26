"use client";

import Link from "next/link";
import { useLanguage } from "@/src/context/LanguageContext";
import LogoMark from "@/src/components/shared/brand/LogoMark";

export default function FooterBrand() {
  const { t } = useLanguage();

  return (
    <div className="max-w-md">
      <Link href="/" className="inline-flex items-center gap-3 text-dracula-fg">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg shadow-[0_0_22px_rgba(189,147,249,0.18)]">
          <LogoMark size={40} />
        </span>
        <span className="font-semibold tracking-tight">{t.common.appName}</span>
      </Link>
      <p className="mt-4 text-sm leading-relaxed">{t.footer.description}</p>
    </div>
  );
}
