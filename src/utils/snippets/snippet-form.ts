import type { CreateSnippetPayload, Snippet } from "@/src/types/snippet";

export interface SnippetFormState {
  code: string;
  description: string;
  isPublic: boolean;
  language: string;
  tagInput: string;
  tags: string[];
  title: string;
}

export const EMPTY_SNIPPET_FORM: SnippetFormState = {
  code: "",
  description: "",
  isPublic: false,
  language: "TypeScript",
  tagInput: "",
  tags: [],
  title: "",
};

export function getInitialSnippetForm(snippet?: Snippet | null): SnippetFormState {
  if (!snippet) return EMPTY_SNIPPET_FORM;

  return {
    code: snippet.code,
    description: snippet.description ?? "",
    isPublic: snippet.public,
    language: snippet.language,
    tagInput: "",
    tags: snippet.tags,
    title: snippet.title,
  };
}

export function getSnippetFormPayload(form: SnippetFormState): CreateSnippetPayload {
  return {
    code: form.code,
    description: form.description,
    language: form.language,
    public: form.isPublic,
    tags: form.tags,
    title: form.title,
  };
}

export function hasRequiredSnippetFields(form: SnippetFormState): boolean {
  return Boolean(form.title.trim() && form.code.trim());
}

export function addSnippetTag(form: SnippetFormState, rawTag: string): SnippetFormState {
  const tag = normalizeTag(rawTag);
  if (!tag || form.tags.includes(tag)) return { ...form, tagInput: "" };

  return {
    ...form,
    tagInput: "",
    tags: [...form.tags, tag],
  };
}

export function commitPendingSnippetTag(form: SnippetFormState): SnippetFormState {
  return form.tagInput.trim() ? addSnippetTag(form, form.tagInput) : form;
}

export function removeSnippetTag(form: SnippetFormState, tag: string): SnippetFormState {
  return {
    ...form,
    tags: form.tags.filter((currentTag) => currentTag !== tag),
  };
}

export function removeLastSnippetTag(form: SnippetFormState): SnippetFormState {
  return { ...form, tags: form.tags.slice(0, -1) };
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/,+$/, "");
}
