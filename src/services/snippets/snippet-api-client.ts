import type { CreateSnippetPayload, Snippet, UpdateSnippetPayload } from "@/src/types/snippet";

export class SnippetApiError extends Error {
  constructor(public readonly status: number) {
    super(String(status));
  }
}

class SnippetApiClient {
  async list(): Promise<Snippet[]> {
    return this.fetchJson("/api/snippets");
  }

  async searchPublic(query: string): Promise<Snippet[]> {
    const params = new URLSearchParams({ q: query });
    return this.fetchJson(`/api/snippets/search?${params.toString()}`);
  }

  async create(payload: CreateSnippetPayload): Promise<Snippet> {
    return this.fetchJson("/api/snippets", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async update(id: string, payload: UpdateSnippetPayload): Promise<Snippet> {
    return this.fetchJson(`/api/snippets/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    if (!response.ok && response.status !== 204) {
      throw new SnippetApiError(response.status);
    }
  }

  private async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, this.withJsonHeaders(init));
    if (!response.ok) {
      throw new SnippetApiError(response.status);
    }
    return response.json();
  }

  private withJsonHeaders(init?: RequestInit): RequestInit | undefined {
    if (!init?.body) return init;

    return {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    };
  }
}

export const snippetApiClient = new SnippetApiClient();
