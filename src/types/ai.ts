import type { AiSnippetAnalysis } from "@/src/lib/validations/ai";

export interface AiUsageSummary {
  limit: number;
  used: number;
  remaining: number;
  cacheHits: number;
  totalRequests: number;
  periodStart: string;
  periodEnd: string;
}

export interface AiSnippetAssistantResponse {
  analysis: AiSnippetAnalysis;
  cacheHit: boolean;
  codeHash: string;
  model: string;
  usage: AiUsageSummary;
}
