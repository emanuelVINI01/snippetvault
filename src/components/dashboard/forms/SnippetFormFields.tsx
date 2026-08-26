"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import type { useSnippetForm } from "@/src/hooks/snippets/use-snippet-form";
import SnippetCodeField from "./SnippetCodeField";
import SnippetTextField from "./SnippetTextField";
import SnippetTitleLanguageFields from "./SnippetTitleLanguageFields";
import TagsInput from "./TagsInput";

import { Lock, Eye, Globe2 } from "lucide-react";

interface SnippetFormFieldsProps {
  descriptionPlaceholder: string;
  form: ReturnType<typeof useSnippetForm>;
  languageListId: string;
}

export default function SnippetFormFields({
  descriptionPlaceholder,
  form,
  languageListId,
}: SnippetFormFieldsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
      <SnippetCodeField code={form.form.code} language={form.form.language} onChange={form.setCode} />
      <SnippetMetadataFields
        descriptionPlaceholder={descriptionPlaceholder}
        form={form}
        languageListId={languageListId}
      />
    </div>
  );
}

function SnippetMetadataFields({
  descriptionPlaceholder,
  form,
  languageListId,
}: SnippetFormFieldsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <SnippetTitleLanguageFields form={form} languageListId={languageListId} />
      <SnippetTextField
        label={t.form.description}
        placeholder={descriptionPlaceholder}
        value={form.form.description}
        onChange={form.setDescription}
      />
      <TagsInput
        inputRef={form.tagRef}
        tagInput={form.form.tagInput}
        tags={form.form.tags}
        onBlur={form.commitPendingTag}
        onFocusRequest={form.focusTags}
        onInputChange={form.setTagInput}
        onKeyDown={form.handleTagKeyDown}
        onRemoveTag={form.removeTag}
      />
      <SnippetVisibilityField value={form.form.visibility} onChange={form.setVisibility} />
    </div>
  );
}

function SnippetVisibilityField({
  value,
  onChange,
}: {
  value: "private" | "unlisted" | "public";
  onChange: (value: "private" | "unlisted" | "public") => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-dracula-comment">Visibilidade</span>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onChange("private")}
          className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all ${
            value === "private"
              ? "border-dracula-purple bg-dracula-purple/10 text-dracula-purple shadow-lg shadow-dracula-purple/5"
              : "border-dracula-card bg-dracula-card/20 text-dracula-comment hover:border-dracula-comment/40 hover:text-dracula-fg"
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Privado</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("unlisted")}
          className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all ${
            value === "unlisted"
              ? "border-dracula-orange bg-dracula-orange/10 text-dracula-orange shadow-lg shadow-dracula-orange/5"
              : "border-dracula-card bg-dracula-card/20 text-dracula-comment hover:border-dracula-comment/40 hover:text-dracula-fg"
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Unlisted</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("public")}
          className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all ${
            value === "public"
              ? "border-dracula-green bg-dracula-green/10 text-dracula-green shadow-lg shadow-dracula-green/5"
              : "border-dracula-card bg-dracula-card/20 text-dracula-comment hover:border-dracula-comment/40 hover:text-dracula-fg"
          }`}
        >
          <Globe2 className="h-3.5 w-3.5" />
          <span>Público</span>
        </button>
      </div>
    </div>
  );
}
