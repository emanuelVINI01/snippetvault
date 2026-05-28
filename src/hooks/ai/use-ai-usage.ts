"use client";

import { useCallback, useEffect, useState } from "react";
import { aiApiClient } from "@/src/services/ai/ai-api-client";
import type { AiUsageSummary } from "@/src/types/ai";

export function useAiUsage() {
  const [usage, setUsage] = useState<AiUsageSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshUsage = useCallback(async () => {
    setLoading(true);
    try {
      setUsage(await aiApiClient.getUsage());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  return { loading, refreshUsage, setUsage, usage };
}
