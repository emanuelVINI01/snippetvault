export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string | null;
  tags: string[];
  public: boolean;
  visibility: "private" | "unlisted" | "public";
  shareToken?: string | null;
  shareExpiresAt?: string | null;
  favorite: boolean;
  pinned: boolean;
  lastUsedAt?: string | null;
  copyCount: number;
  viewCount: number;
  privateNotes?: string | null;
  forkedFromId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetPayload {
  title: string;
  language: string;
  description?: string;
  code: string;
  public?: boolean;
  tags?: string[];
  visibility?: "private" | "unlisted" | "public";
  favorite?: boolean;
  pinned?: boolean;
  privateNotes?: string | null;
}

export type UpdateSnippetPayload = Partial<CreateSnippetPayload> & {
  changeNote?: string;
};
