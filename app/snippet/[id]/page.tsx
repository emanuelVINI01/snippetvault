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
import { prisma } from "@/src/prisma";
import { getSnippetCodeHash, normalizeCodeForHash } from "@/src/services/ai/snippet-ai-service";
import { aiSnippetAnalysisSchema } from "@/src/lib/validations/ai";
import type { PublicSnippetSource } from "@/src/types/public-snippet";

type SnippetPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
};

const getPublicSnippet = cache(async (id: string) => {
  return SnippetService.getPublicById(id);
});

const getSnippetByToken = cache(async (token: string) => {
  return SnippetService.getSnippetByShareToken(token);
});

// A valid, non-expired share token authorizes access to a private snippet;
// the token itself is the proof, so this deliberately bypasses `getPublicById`'s
// visibility filter. Falls back to the normal public lookup otherwise.
async function resolveSnippet(id: string, token?: string): Promise<PublicSnippetSource | null> {
  if (token) {
    const shared = await getSnippetByToken(token);
    if (shared && shared.id === id) return shared as PublicSnippetSource;
  }
  return (await getPublicSnippet(id)) as PublicSnippetSource | null;
}

export async function generateMetadata({ params, searchParams }: SnippetPageProps): Promise<Metadata> {
  const { id } = await params;
  const { token } = await searchParams;
  const snippet = await resolveSnippet(id, token);

  return snippet ? getPublicSnippetMetadata(snippet) : getMissingSnippetMetadata();
}

export default async function PublicSnippetPage({ params, searchParams }: SnippetPageProps) {
  const { id } = await params;
  const { token } = await searchParams;
  const snippet = await resolveSnippet(id, token);

  if (!snippet) {
    notFound();
  }

  const codeHash = getSnippetCodeHash(normalizeCodeForHash(snippet.code));
  const aiAnalysisRecord = await prisma.aiSnippetAnalysis.findUnique({
    where: { codeHash },
  });

  const analysis = aiAnalysisRecord && (aiAnalysisRecord.result as { status?: string } | null)?.status !== "pending"
    ? aiSnippetAnalysisSchema.parse(aiAnalysisRecord.result)
    : null;

  const jsonLd = getPublicSnippetJsonLd(snippet);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PublicSnippetClient snippet={mapPublicSnippetView(snippet)} analysis={analysis} />
    </>
  );
}
