"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { snippetApiClient } from "@/src/services/snippet-api-client";
import type { CreateSnippetPayload, UpdateSnippetPayload } from "@/src/types/snippet";

export function useSnippetMutations() {
  const { t } = useLanguage();

  return {
    createSnippet: async (data: CreateSnippetPayload) => {
      try {
        return await snippetApiClient.create(data);
      } catch {
        throw new Error(t.errors.createSnippet);
      }
    },
    updateSnippet: async (id: string, data: UpdateSnippetPayload) => {
      try {
        return await snippetApiClient.update(id, data);
      } catch {
        throw new Error(t.errors.updateSnippet);
      }
    },
    deleteSnippet: async (id: string) => {
      try {
        await snippetApiClient.delete(id);
      } catch {
        throw new Error(t.errors.deleteSnippet);
      }
    },
  };
}
