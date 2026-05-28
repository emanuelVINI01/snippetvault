import type {
  CreateCollectionPayload,
  SnippetCollection,
  UpdateCollectionPayload,
} from "@/src/types/collection";

export class CollectionApiError extends Error {
  constructor(public readonly status: number) {
    super(String(status));
  }
}

class CollectionApiClient {
  list(): Promise<SnippetCollection[]> {
    return this.fetchJson("/api/collections");
  }

  create(payload: CreateCollectionPayload): Promise<SnippetCollection> {
    return this.fetchJson("/api/collections", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  update(id: string, payload: UpdateCollectionPayload): Promise<SnippetCollection> {
    return this.fetchJson(`/api/collections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/collections/${id}`, { method: "DELETE" });
    if (!response.ok && response.status !== 204) throw new CollectionApiError(response.status);
  }

  addSnippet(collectionId: string, snippetId: string): Promise<SnippetCollection> {
    return this.fetchJson(`/api/collections/${collectionId}/snippets`, {
      method: "POST",
      body: JSON.stringify({ snippetId }),
    });
  }

  removeSnippet(collectionId: string, snippetId: string): Promise<SnippetCollection> {
    return this.fetchJson(`/api/collections/${collectionId}/snippets/${snippetId}`, {
      method: "DELETE",
    });
  }

  private async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...init,
      headers: init?.body
        ? {
            "Content-Type": "application/json",
            ...init.headers,
          }
        : init?.headers,
    });

    if (!response.ok) throw new CollectionApiError(response.status);
    return response.json();
  }
}

export const collectionApiClient = new CollectionApiClient();
