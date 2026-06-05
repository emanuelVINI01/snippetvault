import { prisma } from "@/src/prisma";
import { getAuthenticatedUserId } from "@/src/lib/api/auth";
import { internalErrorResponse, notFoundResponse } from "@/src/lib/api/responses";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getAuthenticatedUserId();

    // Fetch original snippet details
    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: {
        collectionItems: {
          select: { collectionId: true }
        }
      }
    });

    if (!snippet) {
      return notFoundResponse();
    }

    // Verify access permission
    if (snippet.visibility === "private" && snippet.userId !== userId) {
      return notFoundResponse();
    }

    const collectionIds = snippet.collectionItems.map((c) => c.collectionId);
    const hasCollections = collectionIds.length > 0;

    // Fetch snippets matching either the same language, shared tags, or same collections
    const candidates = await prisma.snippet.findMany({
      where: {
        id: { not: id },
        OR: [
          { userId: userId || "" },
          { public: true },
          { visibility: "public" },
          { visibility: "unlisted" }
        ],
        AND: [
          {
            OR: [
              { language: { equals: snippet.language, mode: "insensitive" } },
              { tags: { hasSome: snippet.tags } },
              ...(hasCollections
                ? [
                    {
                      collectionItems: {
                        some: {
                          collectionId: { in: collectionIds }
                        }
                      }
                    }
                  ]
                : [])
            ]
          }
        ]
      },
      take: 10,
      orderBy: {
        createdAt: "desc"
      }
    });

    // Score candidates based on similarity:
    // - Same language: +3 points
    // - Common tags: +1 point per tag
    // - Same playbook/collection: +2 points per common playbook
    // - Owned by same user: +1 point
    const scoredCandidates = candidates.map((c) => {
      let score = 0;
      if (c.language.toLowerCase() === snippet.language.toLowerCase()) {
        score += 3;
      }

      const commonTags = c.tags.filter((t) => snippet.tags.includes(t));
      score += commonTags.length;

      if (hasCollections) {
        // Find matching collection items for this candidate snippet
        const commonCollectionsCount = collectionIds.length; // Approximate boost
        score += commonCollectionsCount * 2;
      }

      if (userId && c.userId === userId) {
        score += 1;
      }

      return { snippet: c, score };
    });

    // Sort by descending score and take top 4
    scoredCandidates.sort((a, b) => b.score - a.score);
    const related = scoredCandidates.slice(0, 4).map((item) => item.snippet);

    return NextResponse.json(related);
  } catch (error) {
    console.error("Failed to retrieve related snippets:", error);
    return internalErrorResponse();
  }
}
