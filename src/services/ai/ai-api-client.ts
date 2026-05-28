import type { AiSnippetAssistantResponse, AiUsageSummary } from "@/src/types/ai";

export class AiApiError extends Error {
  constructor(public readonly status: number) {
    super(String(status));
  }
}

class AiApiClient {
  analyzeSnippet(id: string, locale: "pt" | "en"): Promise<AiSnippetAssistantResponse> {
    return this.fetchJson(`/api/ai/snippets/${id}`, {
      method: "POST",
      body: JSON.stringify({ locale }),
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

    if (!response.ok) throw new AiApiError(response.status);
    return response.json();
  }
}

export const aiApiClient = new AiApiClient();
