"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import Flag from "@/src/components/shared/i18n/Flag";

export default function FooterCopyright() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col gap-3 border-t border-dracula-card/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
      <p className="inline-flex items-center gap-2">
        <Flag locale={language} size={13} />
        &copy; {new Date().getFullYear()} {t.common.appName}. {t.common.allRightsReserved}
      </p>
      <p className="text-dracula-comment/80">{t.footer.version}</p>
    </div>
  );
}
