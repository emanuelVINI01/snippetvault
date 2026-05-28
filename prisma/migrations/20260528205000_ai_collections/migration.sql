-- CreateTable
CREATE TABLE "SnippetCollection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "accent" TEXT NOT NULL DEFAULT 'purple',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SnippetCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnippetCollectionItem" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnippetCollectionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiSnippetAnalysis" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "normalizedLength" INTEGER NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiSnippetAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiUsageEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snippetId" TEXT,
    "codeHash" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "cacheHit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiUsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SnippetCollection_userId_createdAt_idx" ON "SnippetCollection"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SnippetCollectionItem_collectionId_snippetId_key" ON "SnippetCollectionItem"("collectionId", "snippetId");

-- CreateIndex
CREATE INDEX "SnippetCollectionItem_collectionId_position_idx" ON "SnippetCollectionItem"("collectionId", "position");

-- CreateIndex
CREATE INDEX "SnippetCollectionItem_snippetId_idx" ON "SnippetCollectionItem"("snippetId");

-- CreateIndex
CREATE UNIQUE INDEX "AiSnippetAnalysis_codeHash_key" ON "AiSnippetAnalysis"("codeHash");

-- CreateIndex
CREATE INDEX "AiUsageEvent_userId_createdAt_idx" ON "AiUsageEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AiUsageEvent_codeHash_idx" ON "AiUsageEvent"("codeHash");

-- AddForeignKey
ALTER TABLE "SnippetCollection" ADD CONSTRAINT "SnippetCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnippetCollectionItem" ADD CONSTRAINT "SnippetCollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "SnippetCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnippetCollectionItem" ADD CONSTRAINT "SnippetCollectionItem_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageEvent" ADD CONSTRAINT "AiUsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiUsageEvent" ADD CONSTRAINT "AiUsageEvent_codeHash_fkey" FOREIGN KEY ("codeHash") REFERENCES "AiSnippetAnalysis"("codeHash") ON DELETE CASCADE ON UPDATE CASCADE;
