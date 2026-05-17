"use client";

import { useLanguage } from "@/src/context/LanguageContext";

interface DeleteSnippetMessageProps {
  title?: string;
}

export default function DeleteSnippetMessage({ title }: DeleteSnippetMessageProps) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="text-sm leading-relaxed text-dracula-fg">
        {t.form.deleteQuestion}{" "}
        <span className="font-semibold text-dracula-red">&quot;{title}&quot;</span>?
      </p>
      <p className="mt-1.5 text-xs text-dracula-comment">{t.form.deleteWarning}</p>
    </div>
  );
}
