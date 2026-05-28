import type { Snippet } from "./snippet";

export interface SnippetCollectionItem {
  id: string;
  position: number;
  snippet: Snippet;
}

export interface SnippetCollection {
  id: string;
  title: string;
  description?: string | null;
  accent: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  items: SnippetCollectionItem[];
}

export interface CreateCollectionPayload {
  title: string;
  description?: string;
  accent?: string;
}

export type UpdateCollectionPayload = Partial<CreateCollectionPayload>;
