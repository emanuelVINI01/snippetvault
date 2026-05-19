"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import type { useSnippetForm } from "@/src/hooks/snippets/use-snippet-form";
import { COMMON_LANGUAGES } from "../LanguageColors";
import SnippetTextField from "./SnippetTextField";

interface SnippetTitleLanguageFieldsProps {
  form: ReturnType<typeof useSnippetForm>;
  languageListId: string;
}

export default function SnippetTitleLanguageFields({
  form,
  languageListId,
}: SnippetTitleLanguageFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 sm:col-span-1">
        <SnippetTextField
          label={t.form.title}
          placeholder={t.form.titlePlaceholder}
          value={form.form.title}
          onChange={form.setTitle}
        />
      </div>
      <div className="col-span-2 sm:col-span-1">
        <SnippetTextField
          label={t.form.language}
          list={languageListId}
          placeholder="TypeScript"
          value={form.form.language}
          onChange={form.setLanguage}
        />
        <datalist id={languageListId}>
          {COMMON_LANGUAGES.map((language) => (
            <option key={language} value={language} />
          ))}
        </datalist>
      </div>
    </div>
  );
}
