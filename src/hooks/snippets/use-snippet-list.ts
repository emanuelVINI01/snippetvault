"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/src/context/LanguageContext";
import { snippetApiClient, SnippetApiError } from "@/src/services/snippets/snippet-api-client";
import type { Snippet } from "@/src/types/snippet";

export function useSnippetList(initialLoading = false) {
  const router = useRouter();
  const { t } = useLanguage();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = useCallback(async () => {
    await fetchSnippetList({
      load: () => snippetApiClient.list(),
      onUnauthorized: () => router.replace("/login"),
      setError,
      setLoading,
      setSnippets,
      errorMessage: t.errors.loadSnippets,
    });
  }, [router, t.errors.loadSnippets]);

  const fetchGlobalSnippets = useCallback(async (query: string) => {
    await fetchSnippetList({
      load: () => snippetApiClient.searchPublic(query),
      setError,
      setLoading,
      setSnippets,
      errorMessage: t.errors.searchSnippets,
    });
  }, [t.errors.searchSnippets]);

  return { error, fetchGlobalSnippets, fetchSnippets, loading, snippets };
}

interface FetchSnippetListOptions {
  errorMessage: string;
  load: () => Promise<Snippet[]>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSnippets: (snippets: Snippet[]) => void;
  onUnauthorized?: () => void;
}

async function fetchSnippetList({
  errorMessage,
  load,
  onUnauthorized,
  setError,
  setLoading,
  setSnippets,
}: FetchSnippetListOptions) {
  setLoading(true);
  setError(null);

  try {
    setSnippets(await load());
  } catch (error) {
    if (error instanceof SnippetApiError && error.status === 401 && onUnauthorized) {
      onUnauthorized();
      return;
    }
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
}
