"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { useSnippetForm } from "@/src/hooks/snippets/use-snippet-form";
import { useSnippetFormSubmit } from "@/src/hooks/snippets/use-snippet-form-submit";
import { useSnippetMutations } from "@/src/hooks/snippets/use-snippet-mutations";
import Modal from "./Modal";
import SnippetFormFields from "../forms/SnippetFormFields";
import SnippetModalActions from "./SnippetModalActions";

interface CreateSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateSnippetModal({ isOpen, onClose, onCreated }: CreateSnippetModalProps) {
  const { t } = useLanguage();
  const form = useSnippetForm();
  const { createSnippet } = useSnippetMutations();

  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const submit = useSnippetFormSubmit({
    form,
    requiredError: t.form.requiredError,
    unexpectedError: t.form.unexpectedError,
    submit: createSnippet,
    onSuccess: () => {
      form.reset();
      onCreated();
      onClose();
    },
  });

  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImportLoading(true);
    setImportError(null);
    try {
      const res = await fetch("/api/snippets/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t.form.importError);
      }
      const data = await res.json();
      form.fillValues({
        title: data.title || "",
        code: data.code || "",
        language: data.language || "TypeScript",
        description: data.description || "",
        tags: data.tags || [],
      });
      setImportUrl("");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : t.form.importError);
    } finally {
      setImportLoading(false);
    }
  };

  const close = () => {
    form.reset();
    submit.clearError();
    setImportUrl("");
    setImportError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={t.form.createTitle} maxWidth="max-w-6xl">
      <div className="flex flex-col gap-4">
        {/* Seção de Importação de Código */}
        <div className="rounded-2xl border border-dracula-card bg-dracula-card/20 p-4 flex flex-col gap-3">
          <label className="text-sm font-medium text-dracula-cyan flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t.form.importUrl}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder={t.form.importUrlPlaceholder}
              className="flex-1 rounded-xl border border-dracula-card bg-dracula-bg/50 px-4 py-2 text-sm text-dracula-fg placeholder-dracula-comment focus:border-dracula-purple focus:outline-none"
              disabled={importLoading}
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={importLoading || !importUrl.trim()}
              className="rounded-xl bg-dracula-purple px-4 py-2 text-sm font-medium text-dracula-fg hover:bg-dracula-purple/80 disabled:opacity-50 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              {importLoading ? t.form.importing : t.form.importButton}
            </button>
          </div>
          {importError && (
            <p className="text-xs text-dracula-red mt-1">{importError}</p>
          )}
        </div>

        <SnippetFormFields
          descriptionPlaceholder={t.form.descriptionPlaceholder}
          form={form}
          languageListId="create-lang-list"
        />
        {submit.error && <p className="text-sm text-dracula-red">{submit.error}</p>}
        <SnippetModalActions
          loading={submit.loading}
          loadingLabel={t.form.creating}
          submitLabel={t.form.create}
          onCancel={close}
          onSubmit={submit.submit}
        />
      </div>
    </Modal>
  );
}
