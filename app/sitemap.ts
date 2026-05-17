import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { siteConfig } from "@/src/lib/site";
import { SnippetService } from "@/src/services/snippet-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  try {
    const snippets = await SnippetService.getPublicForSitemap();

    return [
      ...staticRoutes,
      ...snippets.map((snippet) => ({
        url: `${siteConfig.url}/snippet/${snippet.id}`,
        lastModified: snippet.updatedAt ?? snippet.createdAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
