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
    <div className="sticky bottom-0 z-10 -mx-4 flex flex-col-reverse gap-2 border-t border-dracula-card/70 bg-dracula-bg/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] pt-3 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-t-0 sm:bg-transparent sm:p-0 sm:pt-1 sm:backdrop-blur-none">
      <button
        onClick={onCancel}
        className="rounded-xl px-4 py-3 text-sm text-dracula-comment transition-colors hover:bg-dracula-card hover:text-dracula-fg sm:py-2"
      >
        {t.common.cancel}
      </button>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="rounded-xl bg-dracula-purple px-5 py-3 text-sm font-semibold text-dracula-bg transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 sm:py-2"
      >
        {loading ? loadingLabel : submitLabel}
      </button>
    </div>
  );
}
