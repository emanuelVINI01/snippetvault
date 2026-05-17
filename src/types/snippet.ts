export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string | null;
  tags: string[];
  public: boolean;
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
}

export type UpdateSnippetPayload = Partial<CreateSnippetPayload>;
