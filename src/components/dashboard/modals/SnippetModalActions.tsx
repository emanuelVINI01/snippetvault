"use client";

import { useLanguage } from "@/src/context/LanguageContext";

interface SnippetModalActionsProps {
  loading: boolean;
  loadingLabel: string;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function SnippetModalActions({
  loading,
  loadingLabel,
  onCancel,
  onSubmit,
  submitLabel,
}: SnippetModalActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex justify-end gap-3 pt-1">
      <button
        onClick={onCancel}
        className="rounded-xl px-4 py-2 text-sm text-dracula-comment transition-colors hover:bg-dracula-card hover:text-dracula-fg"
      >
        {t.common.cancel}
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="rounded-xl bg-dracula-purple px-5 py-2 text-sm font-semibold text-dracula-bg transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
