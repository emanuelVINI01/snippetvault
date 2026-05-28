"use client";

import { useCallback, useEffect, useState } from "react";
import { collectionApiClient } from "@/src/services/collections/collection-api-client";
import type { SnippetCollection } from "@/src/types/collection";

export function useCollections() {
  const [collections, setCollections] = useState<SnippetCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCollections(await collectionApiClient.list());
    } catch {
      setError("Could not load collections.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCollections();
  }, [refreshCollections]);

  return { collections, error, loading, refreshCollections, setCollections };
}
