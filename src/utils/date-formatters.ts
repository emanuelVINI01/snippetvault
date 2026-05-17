import type { Language } from "@/src/i18n/dictionaries";

const LONG_DATE_LOCALES: Record<Language, string> = {
  en: "en-US",
  pt: "pt-BR",
};

export function formatLongDate(date: string | Date, language: Language): string {
  return new Intl.DateTimeFormat(LONG_DATE_LOCALES[language], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
