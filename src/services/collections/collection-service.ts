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
}

export const CollectionService = new CollectionRepository();
