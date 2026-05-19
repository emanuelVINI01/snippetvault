import type { Language } from "@/src/i18n/dictionaries";

const STORAGE_KEY = "app-lang";

class LanguagePreferenceService {
  detect(): Language {
    const storedLanguage = this.getStored();
    if (storedLanguage) return storedLanguage;

    return navigator.language.toLowerCase().startsWith("en") ? "en" : "pt";
  }

  save(language: Language) {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = getDocumentLanguage(language);
  }

  syncDocument(language: Language) {
    document.documentElement.lang = getDocumentLanguage(language);
  }

  private getStored(): Language | null {
    const storedLanguage = localStorage.getItem(STORAGE_KEY);
    return storedLanguage === "pt" || storedLanguage === "en" ? storedLanguage : null;
  }
}

function getDocumentLanguage(language: Language): string {
  return language === "pt" ? "pt-BR" : "en";
}

export const languagePreferenceService = new LanguagePreferenceService();
