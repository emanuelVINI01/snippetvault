"use client";

import { useState } from "react";
import type { CreateSnippetPayload } from "@/src/types/snippet";
import type { SnippetFormController } from "./use-snippet-form";

interface UseSnippetFormSubmitOptions {
  form: SnippetFormController;
  onSuccess: () => void;
  requiredError: string;
  submit: (payload: CreateSnippetPayload) => Promise<unknown>;
  unexpectedError: string;
}

export function useSnippetFormSubmit({
  form,
  onSuccess,
  requiredError,
  submit,
  unexpectedError,
}: UseSnippetFormSubmitOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    error,
    loading,
    clearError: () => setError(null),
    submit: async () => {
      if (!form.hasRequiredFields()) {
        setError(requiredError);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        await submit(form.payload());
        onSuccess();
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : unexpectedError);
      } finally {
        setLoading(false);
      }
    },
  };
}
