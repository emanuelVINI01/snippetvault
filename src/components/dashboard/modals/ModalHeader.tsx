"use client";

import { X } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";

interface ModalHeaderProps {
  onClose: () => void;
  title: string;
}

export default function ModalHeader({ onClose, title }: ModalHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-dracula-card px-4 py-4 sm:px-6">
      <h2 id="modal-title" className="min-w-0 text-base font-semibold text-dracula-fg">
        {title}
      </h2>
      <button
        onClick={onClose}
        className="rounded-lg p-1.5 text-dracula-comment transition-colors hover:bg-dracula-card hover:text-dracula-fg"
        aria-label={t.common.close}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
