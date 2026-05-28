"use client";

import CodeEditor from "../editor/CodeEditor";
import { useLanguage } from "@/src/context/LanguageContext";

interface SnippetCodeFieldProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
}

export default function SnippetCodeField({ code, language, onChange }: SnippetCodeFieldProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs font-medium text-dracula-comment">{t.form.code}</label>
      <CodeEditor
        value={code}
        onChange={onChange}
        language={language}
        placeholder={t.form.codePlaceholder}
        ariaLabel={t.form.code}
        minHeight="clamp(220px, 42dvh, 560px)"
      />
    </div>
  );
}
