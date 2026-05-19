"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import type { useSnippetForm } from "@/src/hooks/snippets/use-snippet-form";
import PublicSnippetToggle from "./PublicSnippetToggle";
import SnippetCodeField from "./SnippetCodeField";
import SnippetTextField from "./SnippetTextField";
import SnippetTitleLanguageFields from "./SnippetTitleLanguageFields";
import TagsInput from "./TagsInput";

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
      <PublicSnippetToggle checked={form.form.isPublic} onChange={form.setIsPublic} />
    </div>
  );
}
