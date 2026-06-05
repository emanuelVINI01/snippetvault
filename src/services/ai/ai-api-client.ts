import type { AiSnippetAssistantResponse, AiUsageSummary } from "@/src/types/ai";

export class AiApiError extends Error {
  constructor(public readonly status: number, message?: string) {
    super(message || String(status));
  }
}

class AiApiClient {
  analyzeSnippet(id: string, locale: "pt" | "en", checkOnly?: boolean, forceRefresh?: boolean): Promise<AiSnippetAssistantResponse> {
    return this.fetchJson(`/api/ai/snippets/${id}`, {
      method: "POST",
      body: JSON.stringify({ locale, checkOnly, forceRefresh }),
    });
  }

  getUsage(): Promise<AiUsageSummary> {
    return this.fetchJson("/api/ai/usage");
  }

  private async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      let message = "";
      try {
        const body = await response.json();
        message = body.error || "";
      } catch {}
      throw new AiApiError(response.status, message);
    }
    return response.json();
  }
}

export const aiApiClient = new AiApiClient();
