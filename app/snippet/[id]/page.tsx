import { notFound } from "next/navigation";
import { SnippetService } from "@/src/services/snippets/snippet-service";
import PublicSnippetClient from "@/src/components/snippet/PublicSnippetClient";
import { mapPublicSnippetView } from "@/src/mappers/public-snippet-mapper";
import {
  getMissingSnippetMetadata,
  getPublicSnippetJsonLd,
  getPublicSnippetMetadata,
} from "@/src/lib/snippet-seo";
import type { Metadata } from "next";
import { cache } from "react";

type SnippetPageProps = {
  params: Promise<{ id: string }>;
};

const getPublicSnippet = cache(async (id: string) => {
  return SnippetService.getPublicById(id);
});

export async function generateMetadata({ params }: SnippetPageProps): Promise<Metadata> {
  const { id } = await params;
  const snippet = await getPublicSnippet(id);

  return snippet ? getPublicSnippetMetadata(snippet) : getMissingSnippetMetadata();
}

export default async function PublicSnippetPage({ params }: SnippetPageProps) {
  const { id } = await params;
  const snippet = await getPublicSnippet(id);

  if (!snippet) {
    notFound();
  }

  const jsonLd = getPublicSnippetJsonLd(snippet);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PublicSnippetClient snippet={mapPublicSnippetView(snippet)} />
    </>
  );
}
