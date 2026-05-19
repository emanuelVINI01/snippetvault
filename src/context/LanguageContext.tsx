"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type Dictionary, type Language } from "@/src/i18n/dictionaries";
import { languagePreferenceService } from "@/src/services/preferences/language-preference-service";

interface LanguageContextProps {
  language: Language;
  t: Dictionary;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const nextLanguage = languagePreferenceService.detect();
      setLanguageState(nextLanguage);
      languagePreferenceService.syncDocument(nextLanguage);
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    languagePreferenceService.save(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const nextLanguage = prev === "pt" ? "en" : "pt";
      languagePreferenceService.save(nextLanguage);
      return nextLanguage;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, t: dictionaries[language], toggleLanguage, setLanguage }}>
      <div className={mounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
