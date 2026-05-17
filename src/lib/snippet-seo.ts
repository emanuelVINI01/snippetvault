import type { Metadata } from "next";
import { getSnippetPath, getSnippetUrl } from "@/src/utils/routes";
import { siteConfig } from "@/src/lib/site";
import type { PublicSnippetSource } from "@/src/types/public-snippet";

export function getPublicSnippetDescription(snippet: Pick<PublicSnippetSource, "description" | "language"> | null) {
  if (!snippet) return siteConfig.description;

  return (
    snippet.description ||
    `Snippet de ${snippet.language} compartilhado no SnippetVault para consulta e reutilizacao.`
  );
}

export function getMissingSnippetMetadata(): Metadata {
  return {
    title: "Snippet nao encontrado",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function getPublicSnippetMetadata(snippet: PublicSnippetSource): Metadata {
  const description = getPublicSnippetDescription(snippet);
  const path = getSnippetPath(snippet.id);

  return {
    title: snippet.title,
    description,
    keywords: [
      snippet.title,
      snippet.language,
      "snippet de codigo",
      "exemplo de codigo",
      ...snippet.tags,
    ],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: snippet.title,
      description,
      url: path,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `Snippet ${snippet.title} no SnippetVault`,
        },
      ],
      type: "article",
      publishedTime: snippet.createdAt.toISOString(),
      modifiedTime: snippet.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: snippet.title,
      description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function getPublicSnippetJsonLd(snippet: PublicSnippetSource) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: snippet.title,
    description: getPublicSnippetDescription(snippet),
    url: getSnippetUrl(snippet.id),
    programmingLanguage: snippet.language,
    keywords: snippet.tags.join(", "),
    dateCreated: snippet.createdAt.toISOString(),
    dateModified: snippet.updatedAt.toISOString(),
    author: getJsonLdAuthor(snippet),
  };
}

function getJsonLdAuthor(snippet: PublicSnippetSource) {
  if (!snippet.user?.name) return undefined;

  return {
    "@type": "Person",
    name: snippet.user.name,
  };
}
