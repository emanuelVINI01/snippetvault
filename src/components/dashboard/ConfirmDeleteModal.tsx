"use client";

import { useState } from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";
import type { Snippet } from "./SnippetCard";
import { useSnippets } from "@/src/hook/use-snippets-hook";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
  snippet: Snippet | null;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onDeleted, snippet }: ConfirmDeleteModalProps) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const { deleteSnippet } = useSnippets();

  const handleDelete = async () => {
    if (!snippet) return;
    setLoading(true); setError(null);
    try {
      await deleteSnippet(snippet.id);
      onDeleted();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão" maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-5">
        {/* Warning icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-dracula-red/10 border border-dracula-red/30">
          <AlertTriangle className="w-7 h-7 text-dracula-red" />
        </div>

        <div>
          <p className="text-dracula-fg text-sm leading-relaxed">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-dracula-red">
              &quot;{snippet?.title}&quot;
            </span>
            ?
          </p>
          <p className="text-dracula-comment text-xs mt-1.5">
            Esta ação é irreversível e não pode ser desfeita.
          </p>
        </div>

        {error && <p className="text-sm text-dracula-red">{error}</p>}

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-dracula-comment hover:text-dracula-fg hover:bg-dracula-card border border-dracula-card transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-dracula-red text-dracula-fg hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all duration-150"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
