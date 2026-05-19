"use client";

import { useLanguage } from "@/src/context/LanguageContext";

interface DeleteSnippetActionsProps {
  loading: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteSnippetActions({
  loading,
  onCancel,
  onDelete,
}: DeleteSnippetActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex w-full gap-3">
      <button
        onClick={onCancel}
        disabled={loading}
        className="flex-1 rounded-xl border border-dracula-card px-4 py-2.5 text-sm text-dracula-comment transition-colors hover:bg-dracula-card hover:text-dracula-fg"
      >
        {t.common.cancel}
      </button>
      <button
        onClick={onDelete}
        disabled={loading}
        className="flex-1 rounded-xl bg-dracula-red px-4 py-2.5 text-sm font-semibold text-dracula-fg transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? t.form.deleting : t.form.delete}
      </button>
    </div>
  );
}
