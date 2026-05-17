"use client";

import { useLanguage } from "@/src/context/LanguageContext";

export default function FooterCopyright() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-3 border-t border-dracula-card/50 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
      <p>
        &copy; {new Date().getFullYear()} {t.common.appName}. {t.common.allRightsReserved}
      </p>
      <p className="text-dracula-comment/80">{t.footer.version}</p>
    </div>
  );
}
