"use client";

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

  const close = () => {
    form.reset();
    submit.clearError();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={t.form.createTitle} maxWidth="max-w-6xl">
      <div className="flex flex-col gap-4">
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
