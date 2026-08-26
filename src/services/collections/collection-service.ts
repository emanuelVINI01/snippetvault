import { prisma } from "@/src/prisma";
import type {
  CollectionCreateInput,
  CollectionUpdateInput,
} from "@/src/lib/validations/collections";

const COLLECTION_INCLUDE = {
  items: {
    orderBy: { position: "asc" as const },
    include: { snippet: true },
  },
};

class CollectionRepository {
  getAll(userId: string) {
    return prisma.snippetCollection.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: COLLECTION_INCLUDE,
    });
  }

  create(userId: string, data: CollectionCreateInput) {
    return prisma.snippetCollection.create({
      data: {
        accent: data.accent ?? "purple",
        description: data.description,
        title: data.title,
        userId,
      },
      include: COLLECTION_INCLUDE,
    });
  }

  update(id: string, userId: string, data: CollectionUpdateInput) {
    return prisma.snippetCollection.update({
      where: { id, userId },
      data,
      include: COLLECTION_INCLUDE,
    });
  }

  delete(id: string, userId: string) {
    return prisma.snippetCollection.delete({ where: { id, userId } });
  }

  async addSnippet(collectionId: string, snippetId: string, userId: string) {
    await this.assertOwnedCollectionAndSnippet(collectionId, snippetId, userId);
    const position = await prisma.snippetCollectionItem.count({ where: { collectionId } });

    await prisma.snippetCollectionItem.upsert({
      where: { collectionId_snippetId: { collectionId, snippetId } },
      create: { collectionId, position, snippetId },
      update: {},
    });

    return this.getById(collectionId, userId);
  }

  async removeSnippet(collectionId: string, snippetId: string, userId: string) {
    await prisma.snippetCollection.findUniqueOrThrow({
      where: { id: collectionId, userId },
      select: { id: true },
    });
    await prisma.snippetCollectionItem.delete({
      where: { collectionId_snippetId: { collectionId, snippetId } },
    });

    return this.getById(collectionId, userId);
  }

  getById(id: string, userId: string) {
    return prisma.snippetCollection.findUniqueOrThrow({
      where: { id, userId },
      include: COLLECTION_INCLUDE,
    });
  }

  /** Same shape as getById, but returns null instead of throwing when the
   * collection doesn't exist or isn't owned by the user (export route
   * needs a graceful 404, not a 500). */
  getForExport(id: string, userId: string) {
    return prisma.snippetCollection.findFirst({
      where: { id, userId },
      include: COLLECTION_INCLUDE,
    });
  }

  private async assertOwnedCollectionAndSnippet(
    collectionId: string,
    snippetId: string,
    userId: string,
  ) {
    await Promise.all([
      prisma.snippetCollection.findUniqueOrThrow({
        where: { id: collectionId, userId },
        select: { id: true },
      }),
      prisma.snippet.findUniqueOrThrow({
        where: { id: snippetId, userId },
        select: { id: true },
      }),
    ]);
  }

  async createRun(collectionId: string, userId: string, title?: string) {
    const collection = await prisma.snippetCollection.findUniqueOrThrow({
      where: { id: collectionId, userId },
      include: {
        items: {
          orderBy: { position: "asc" },
        },
      },
    });

    return prisma.$transaction(async (tx) => {
      const run = await tx.playbookRun.create({
        data: {
          collectionId,
          userId,
          title: title || `${collection.title} - ${new Date().toLocaleDateString()}`,
          status: "active",
        },
      });

      if (collection.items.length > 0) {
        await tx.playbookRunItem.createMany({
          data: collection.items.map((item, index) => ({
            runId: run.id,
            collectionItemId: item.id,
            snippetId: item.snippetId,
            position: index,
            status: "pending",
          })),
        });
      }

      return tx.playbookRun.findUnique({
        where: { id: run.id },
        include: {
          items: {
            orderBy: { position: "asc" },
          },
        },
      });
    });
  }

  async getRuns(collectionId: string, userId: string) {
    return prisma.playbookRun.findMany({
      where: { collectionId, userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async getRunById(runId: string, collectionId: string, userId: string) {
    return prisma.playbookRun.findFirst({
      where: { id: runId, collectionId, userId },
      include: {
        items: {
          orderBy: { position: "asc" },
        },
      },
    });
  }

  async updateRun(
    runId: string,
    collectionId: string,
    userId: string,
    data: {
      status?: "active" | "completed" | "abandoned";
      items?: {
        id: string;
        status?: "pending" | "done" | "skipped";
        notes?: string | null;
      }[];
    }
  ) {
    const run = await prisma.playbookRun.findFirst({
      where: { id: runId, collectionId, userId },
    });
    if (!run) throw new Error("Playbook run not found or unauthorized");

    return prisma.$transaction(async (tx) => {
      if (data.status) {
        await tx.playbookRun.update({
          where: { id: runId },
          data: { status: data.status },
        });
      }

      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await tx.playbookRunItem.update({
            where: { id: item.id, runId },
            data: {
              status: item.status,
              notes: item.notes,
              completedAt: item.status === "done" ? new Date() : undefined,
            },
          });
        }
      }

      return tx.playbookRun.findUnique({
        where: { id: runId },
        include: {
          items: {
            orderBy: { position: "asc" },
          },
        },
      });
    });
  }

  async updateCollectionItem(
    collectionId: string,
    snippetId: string,
    userId: string,
    filePath: string | null
  ) {
    await prisma.snippetCollection.findUniqueOrThrow({
      where: { id: collectionId, userId },
    });

    await prisma.snippetCollectionItem.update({
      where: { collectionId_snippetId: { collectionId, snippetId } },
      data: { filePath },
    });

    return this.getById(collectionId, userId);
  }
}

export const CollectionService = new CollectionRepository();
