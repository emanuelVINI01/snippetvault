"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Snippet } from "@/src/components/dashboard/SnippetCard";
import { useLanguage } from "@/src/context/LanguageContext";

export function useSnippets(initialLoading = false) {
  const router = useRouter();
  const { t } = useLanguage();

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/snippets");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (!res.ok) throw new Error(t.errors.loadSnippets);
      const data = await res.json();
      setSnippets(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.errors.unexpected);
    } finally {
      setLoading(false);
    }
  }, [router, t.errors.loadSnippets, t.errors.unexpected]);

  const fetchGlobalSnippets = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/snippets/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(t.errors.searchSnippets);
      const data = await res.json();
      setSnippets(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.errors.unexpected);
    } finally {
      setLoading(false);
    }
  }, [t.errors.searchSnippets, t.errors.unexpected]);

  const createSnippet = async (data: { title: string; language: string; description?: string; code: string; public?: boolean; tags?: string[] }) => {
    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(t.errors.createSnippet);
    return res.json();
  };

  const updateSnippet = async (id: string, data: Partial<{ title: string; language: string; description: string; code: string; public: boolean; tags: string[] }>) => {
    const res = await fetch(`/api/snippets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(t.errors.updateSnippet);
    return res.json();
  };

  const deleteSnippet = async (id: string) => {
    const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error(t.errors.deleteSnippet);
  };

  return {
    snippets,
    loading,
    error,
    fetchSnippets,
    fetchGlobalSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
  };
}
