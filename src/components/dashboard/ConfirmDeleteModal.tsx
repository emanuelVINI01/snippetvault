"use client";

import { useState } from "react";
import Modal from "./Modal";
import type { Snippet } from "@/src/types/snippet";
import { useSnippetMutations } from "@/src/hooks/use-snippet-mutations";
import { useLanguage } from "@/src/context/LanguageContext";
import DeleteSnippetActions from "./DeleteSnippetActions";
import DeleteSnippetMessage from "./DeleteSnippetMessage";
import DeleteWarningIcon from "./DeleteWarningIcon";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  snippet: Snippet | null;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onDeleted, snippet }: ConfirmDeleteModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deleteSnippet } = useSnippetMutations();

  const handleDelete = async () => {
    if (!snippet) return;
    setLoading(true);
    setError(null);
    try {
      await deleteSnippet(snippet.id);
      onDeleted();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.form.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.form.deleteTitle} maxWidth="max-w-sm">
      <div className="flex flex-col items-center gap-5 text-center">
        <DeleteWarningIcon />
        <DeleteSnippetMessage title={snippet?.title} />
        {error && <p className="text-sm text-dracula-red">{error}</p>}
        <DeleteSnippetActions loading={loading} onCancel={onClose} onDelete={handleDelete} />
      </div>
    </Modal>
  );
}
