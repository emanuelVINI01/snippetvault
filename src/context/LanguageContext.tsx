"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Dictionary, type Language } from "@/src/i18n/dictionaries";

interface LanguageContextProps {
  language: Language;
  t: Dictionary;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

function setDocumentLanguage(language: Language) {
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const storedLang = localStorage.getItem("app-lang") as Language | null;
      const nextLanguage =
        storedLang === "pt" || storedLang === "en"
          ? storedLang
          : navigator.language.toLowerCase().startsWith("en")
            ? "en"
            : "pt";

      setLanguageState(nextLanguage);
      setDocumentLanguage(nextLanguage);
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-lang", lang);
    setDocumentLanguage(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => {
      const nextLanguage = prev === "pt" ? "en" : "pt";
      localStorage.setItem("app-lang", nextLanguage);
      setDocumentLanguage(nextLanguage);
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
