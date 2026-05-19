"use client";

import { X } from "lucide-react";
import type { KeyboardEvent, RefObject } from "react";
import { useLanguage } from "@/src/context/LanguageContext";

interface TagsInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  tagInput: string;
  tags: string[];
  onBlur: () => void;
  onFocusRequest: () => void;
  onInputChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
}

export default function TagsInput({
  inputRef,
  onBlur,
  onFocusRequest,
  onInputChange,
  onKeyDown,
  onRemoveTag,
  tagInput,
  tags,
}: TagsInputProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-dracula-comment">
        {t.form.tags} <span className="text-dracula-comment/50">({t.form.tagsHint})</span>
      </label>
      <div
        className="flex min-h-[42px] cursor-text flex-wrap items-center gap-1.5 rounded-xl border border-dracula-card bg-dracula-card/40 px-3 py-2 transition-all duration-150 focus-within:border-dracula-purple focus-within:ring-2 focus-within:ring-dracula-purple/20"
        onClick={onFocusRequest}
      >
        {tags.map((tag) => (
          <TagPill key={tag} tag={tag} onRemove={onRemoveTag} />
        ))}
        <input
          ref={inputRef}
          value={tagInput}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={tags.length === 0 ? t.form.tagsPlaceholder : ""}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-dracula-fg outline-none placeholder:text-dracula-comment/50"
        />
      </div>
    </div>
  );
}

function TagPill({ tag, onRemove }: { tag: string; onRemove: (tag: string) => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full border border-dracula-purple/30 bg-dracula-purple/15 px-2 py-0.5 text-xs text-dracula-purple">
      #{tag}
      <button
        onClick={(event) => {
          event.stopPropagation();
          onRemove(tag);
        }}
        className="ml-0.5 transition-colors hover:text-dracula-red"
        type="button"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  );
}
