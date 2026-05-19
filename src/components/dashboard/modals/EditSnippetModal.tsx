"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { useSnippetForm } from "@/src/hooks/snippets/use-snippet-form";
import { useSnippetFormSubmit } from "@/src/hooks/snippets/use-snippet-form-submit";
import { useSnippetMutations } from "@/src/hooks/snippets/use-snippet-mutations";
import type { Snippet } from "@/src/types/snippet";
import Modal from "./Modal";
import SnippetFormFields from "../forms/SnippetFormFields";
import SnippetModalActions from "./SnippetModalActions";

interface EditSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  snippet: Snippet | null;
}

export default function EditSnippetModal({ isOpen, onClose, onUpdated, snippet }: EditSnippetModalProps) {
  const { t } = useLanguage();

  const close = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={t.form.editTitle} maxWidth="max-w-6xl">
      {snippet && (
        <EditSnippetModalContent
          key={snippet.id}
          onClose={close}
          onUpdated={onUpdated}
          snippet={snippet}
        />
      )}
    </Modal>
  );
}

function EditSnippetModalContent({
  onClose,
  onUpdated,
  snippet,
}: {
  onClose: () => void;
  onUpdated: () => void;
  snippet: Snippet;
}) {
  const { t } = useLanguage();
  const form = useSnippetForm(snippet);
  const { updateSnippet } = useSnippetMutations();
  const submit = useSnippetFormSubmit({
    form,
    requiredError: t.form.requiredError,
    unexpectedError: t.form.unexpectedError,
    submit: (payload) => updateSnippet(snippet.id, payload),
    onSuccess: () => {
      onUpdated();
      onClose();
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <SnippetFormFields
        descriptionPlaceholder={t.form.editDescriptionPlaceholder}
        form={form}
        languageListId="edit-lang-list"
      />
      {submit.error && <p className="text-sm text-dracula-red">{submit.error}</p>}
      <SnippetModalActions
        loading={submit.loading}
        loadingLabel={t.form.saving}
        submitLabel={t.form.save}
        onCancel={onClose}
        onSubmit={submit.submit}
      />
    </div>
  );
}
