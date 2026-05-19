import { prisma } from "@/src/prisma";
import type { CreateSnippetInput, UpdateSnippetInput } from "@/src/lib/validations/snippet";

const AUTHOR_SELECT = {
  id: true,
  image: true,
  name: true,
};

class SnippetRepository {
  getAll(userId: string) {
    return prisma.snippet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  create(userId: string, data: CreateSnippetInput) {
    return prisma.snippet.create({
      data: { ...data, userId },
    });
  }

  update(id: string, userId: string, data: UpdateSnippetInput) {
    return prisma.snippet.update({
      where: { id, userId },
      data,
    });
  }

  delete(id: string, userId: string) {
    return prisma.snippet.delete({
      where: { id, userId },
    });
  }

  searchPublic(query: string) {
    return prisma.snippet.findMany({
      where: getPublicSearchWhere(query),
      orderBy: { createdAt: "desc" },
      include: { user: { select: AUTHOR_SELECT } },
    });
  }

  getById(id: string) {
    return prisma.snippet.findUnique({
      where: { id },
      include: { user: { select: AUTHOR_SELECT } },
    });
  }

  getPublicById(id: string) {
    return prisma.snippet.findFirst({
      where: { id, public: true },
      include: { user: { select: AUTHOR_SELECT } },
    });
  }

  getPublicForSitemap() {
    return prisma.snippet.findMany({
      where: { public: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        updatedAt: true,
        createdAt: true,
      },
      take: 5000,
    });
  }
}

function getPublicSearchWhere(query: string) {
  const trimmedQuery = query.trim();

  return {
    public: true,
    OR: trimmedQuery
      ? [
          { title: { contains: trimmedQuery, mode: "insensitive" as const } },
          { description: { contains: trimmedQuery, mode: "insensitive" as const } },
          { language: { contains: trimmedQuery, mode: "insensitive" as const } },
          { tags: { hasSome: [trimmedQuery] } },
        ]
      : undefined,
  };
}

export const SnippetService = new SnippetRepository();
