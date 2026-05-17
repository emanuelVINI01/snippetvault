import { siteConfig } from "@/src/lib/site";

export function getSnippetPath(snippetId: string): string {
  return `/snippet/${snippetId}`;
}

export function getSnippetUrl(snippetId: string, origin = siteConfig.url): string {
  return `${origin}${getSnippetPath(snippetId)}`;
}
