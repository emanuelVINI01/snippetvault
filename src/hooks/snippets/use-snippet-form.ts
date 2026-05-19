"use client";

import { KeyboardEvent, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  EMPTY_SNIPPET_FORM,
  addSnippetTag,
  commitPendingSnippetTag,
  getInitialSnippetForm,
  getSnippetFormPayload,
  hasRequiredSnippetFields,
  removeLastSnippetTag,
  removeSnippetTag,
  type SnippetFormState,
} from "@/src/utils/snippets/snippet-form";
import type { Snippet } from "@/src/types/snippet";

export function useSnippetForm(snippet?: Snippet | null) {
  const [form, setForm] = useState(() => getInitialSnippetForm(snippet));
  const tagRef = useRef<HTMLInputElement>(null);

  return {
    form,
    tagRef,
    addTag: (tag: string) => setForm((current) => addSnippetTag(current, tag)),
    commitPendingTag: () => setForm(commitPendingSnippetTag),
    focusTags: () => tagRef.current?.focus(),
    handleTagKeyDown: (event: KeyboardEvent<HTMLInputElement>) => handleTagKeyDown(event, setForm),
    hasRequiredFields: () => hasRequiredSnippetFields(form),
    payload: () => getSnippetFormPayload(form),
    removeTag: (tag: string) => setForm((current) => removeSnippetTag(current, tag)),
    reset: () => setForm(EMPTY_SNIPPET_FORM),
    setCode: (code: string) => setForm((current) => ({ ...current, code })),
    setDescription: (description: string) => setForm((current) => ({ ...current, description })),
    setIsPublic: (isPublic: boolean) => setForm((current) => ({ ...current, isPublic })),
    setLanguage: (language: string) => setForm((current) => ({ ...current, language })),
    setTagInput: (tagInput: string) => setForm((current) => ({ ...current, tagInput })),
    setTitle: (title: string) => setForm((current) => ({ ...current, title })),
  };
}

export type SnippetFormController = ReturnType<typeof useSnippetForm>;

function handleTagKeyDown(
  event: KeyboardEvent<HTMLInputElement>,
  setForm: Dispatch<SetStateAction<SnippetFormState>>,
) {
  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    setForm(commitPendingSnippetTag);
    return;
  }

  if (event.key === "Backspace" && event.currentTarget.value === "") {
    setForm(removeLastSnippetTag);
  }
}
