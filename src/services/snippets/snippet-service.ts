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
      orderBy: [
        { pinned: "desc" },
        { createdAt: "desc" }
      ],
    });
  }

  async create(userId: string, data: CreateSnippetInput) {
    const synced = { ...data };
    if (synced.visibility !== undefined) {
      synced.public = synced.visibility === "public";
    } else if (synced.public !== undefined) {
      synced.visibility = synced.public ? "public" : "private";
    } else {
      synced.visibility = "private";
      synced.public = false;
    }

    const snippet = await prisma.snippet.create({
      data: {
        title: synced.title,
        code: synced.code,
        language: synced.language,
        description: synced.description,
        public: synced.public,
        tags: synced.tags,
        visibility: synced.visibility,
        favorite: synced.favorite,
        pinned: synced.pinned,
        privateNotes: synced.privateNotes,
        shareToken: synced.shareToken,
        shareExpiresAt: synced.shareExpiresAt,
        userId,
      },
    });

    // Create version 1
    await prisma.snippetVersion.create({
      data: {
        snippetId: snippet.id,
        version: 1,
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
        description: snippet.description,
        tags: snippet.tags,
        public: snippet.public,
        visibility: snippet.visibility,
        changeNote: "Versão inicial",
      },
    });

    return snippet;
  }

  async update(id: string, userId: string, data: UpdateSnippetInput & { changeNote?: string }) {
    const current = await prisma.snippet.findFirst({
      where: { id, userId },
    });
    if (!current) throw new Error("Snippet not found or unauthorized");

    const synced = { ...data };
    if (synced.visibility !== undefined) {
      synced.public = synced.visibility === "public";
    } else if (synced.public !== undefined) {
      synced.visibility = synced.public ? "public" : "private";
    }

    const changeNote = synced.changeNote;
    delete synced.changeNote;

    const hasCoreChanges =
      (synced.title !== undefined && synced.title !== current.title) ||
      (synced.code !== undefined && synced.code !== current.code) ||
      (synced.language !== undefined && synced.language !== current.language) ||
      (synced.description !== undefined && synced.description !== current.description) ||
      (synced.tags !== undefined && JSON.stringify(synced.tags) !== JSON.stringify(current.tags)) ||
      (synced.visibility !== undefined && synced.visibility !== current.visibility);

    const updated = await prisma.snippet.update({
      where: { id, userId },
      data: synced,
    });

    if (hasCoreChanges) {
      const lastVersion = await prisma.snippetVersion.findFirst({
        where: { snippetId: id },
        orderBy: { version: "desc" },
      });

      let nextVersionNumber = 1;
      if (lastVersion) {
        nextVersionNumber = lastVersion.version + 1;
      } else {
        // Create version 1 for original state of pre-existing snippet
        await prisma.snippetVersion.create({
          data: {
            snippetId: id,
            version: 1,
            title: current.title,
            code: current.code,
            language: current.language,
            description: current.description,
            tags: current.tags,
            public: current.public,
            visibility: current.visibility,
            changeNote: "Estado original",
            createdAt: current.updatedAt,
          },
        });
        nextVersionNumber = 2;
      }

      await prisma.snippetVersion.create({
        data: {
          snippetId: id,
          version: nextVersionNumber,
          title: updated.title,
          code: updated.code,
          language: updated.language,
          description: updated.description,
          tags: updated.tags,
          public: updated.public,
          visibility: updated.visibility,
          changeNote: changeNote || `Atualização para versão ${nextVersionNumber}`,
        },
      });
    }

    return updated;
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

  getOwnedById(id: string, userId: string) {
    return prisma.snippet.findFirst({
      where: { id, userId },
    });
  }

  getPublicById(id: string) {
    return prisma.snippet.findFirst({
      where: {
        id,
        OR: [
          { public: true },
          { visibility: "unlisted" },
          { visibility: "public" },
        ],
      },
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

  getVersions(snippetId: string, userId: string) {
    return prisma.snippetVersion.findMany({
      where: {
        snippetId,
        snippet: { userId },
      },
      orderBy: { version: "desc" },
    });
  }

  getVersion(snippetId: string, versionId: string, userId: string) {
    return prisma.snippetVersion.findFirst({
      where: {
        id: versionId,
        snippetId,
        snippet: { userId },
      },
    });
  }

  async restoreVersion(snippetId: string, versionId: string, userId: string) {
    const version = await this.getVersion(snippetId, versionId, userId);
    if (!version) throw new Error("Version not found");

    return this.update(snippetId, userId, {
      title: version.title,
      code: version.code,
      language: version.language,
      description: version.description,
      tags: version.tags,
      visibility: version.visibility as "private" | "unlisted" | "public",
      changeNote: `Restaurado para versão ${version.version}`,
    });
  }

  async generateShareToken(id: string, userId: string, expiresAt?: Date | null) {
    const shareToken = crypto.randomUUID();
    return prisma.snippet.update({
      where: { id, userId },
      data: {
        shareToken,
        shareExpiresAt: expiresAt || null,
      },
    });
  }

  async revokeShareToken(id: string, userId: string) {
    return prisma.snippet.update({
      where: { id, userId },
      data: {
        shareToken: null,
        shareExpiresAt: null,
      },
    });
  }

  async updateVisibility(id: string, userId: string, visibility: "private" | "unlisted" | "public") {
    return this.update(id, userId, { visibility });
  }

  getSnippetByShareToken(shareToken: string) {
    return prisma.snippet.findFirst({
      where: {
        shareToken,
        OR: [
          { shareExpiresAt: null },
          { shareExpiresAt: { gt: new Date() } },
        ],
      },
      include: { user: { select: AUTHOR_SELECT } },
    });
  }

  async fork(id: string, userId: string) {
    const target = await prisma.snippet.findFirst({
      where: {
        id,
        OR: [
          { public: true },
          { visibility: "unlisted" },
          { visibility: "public" },
          { userId },
        ],
      },
    });

    if (!target) throw new Error("Snippet not found or not shareable");

    const forked = await this.create(userId, {
      title: `${target.title} (Fork)`,
      code: target.code,
      language: target.language,
      description: target.description ?? undefined,
      tags: target.tags,
      visibility: "private",
      public: false,
      favorite: false,
      pinned: false,
    });

    return prisma.snippet.update({
      where: { id: forked.id },
      data: {
        forkedFromId: target.id,
      },
    });
  }

  getVariables(snippetId: string, userId: string) {
    return prisma.snippetVariable.findMany({
      where: {
        snippetId,
        snippet: { userId },
      },
      orderBy: { name: "asc" },
    });
  }

  async updateVariables(
    snippetId: string,
    userId: string,
    variables: {
      name: string;
      label?: string | null;
      description?: string | null;
      defaultValue?: string | null;
      required?: boolean;
    }[]
  ) {
    const snippet = await prisma.snippet.findFirst({
      where: { id: snippetId, userId },
    });
    if (!snippet) throw new Error("Snippet not found or unauthorized");

    return prisma.$transaction(async (tx) => {
      await tx.snippetVariable.deleteMany({
        where: { snippetId },
      });

      if (variables.length === 0) return [];

      await tx.snippetVariable.createMany({
        data: variables.map((v) => ({
          snippetId,
          name: v.name,
          label: v.label ?? null,
          description: v.description ?? null,
          defaultValue: v.defaultValue ?? null,
          required: v.required !== undefined ? v.required : true,
        })),
      });

      return tx.snippetVariable.findMany({
        where: { snippetId },
        orderBy: { name: "asc" },
      });
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
