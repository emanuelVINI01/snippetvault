export interface PublicSnippetAuthor {
  id: string;
  image: string | null;
  name: string | null;
}

export interface PublicSnippetView {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string | null;
  tags: string[];
  public: boolean;
  createdAt: string;
  user?: PublicSnippetAuthor | null;
}

export interface PublicSnippetSource extends Omit<PublicSnippetView, "createdAt"> {
  createdAt: Date;
  updatedAt: Date;
}
