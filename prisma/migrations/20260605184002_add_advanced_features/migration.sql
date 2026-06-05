-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "copyCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "forkedFromId" TEXT,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "pinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privateNotes" TEXT,
ADD COLUMN     "shareExpiresAt" TIMESTAMP(3),
ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'private';

-- AlterTable
ALTER TABLE "SnippetCollection" ADD COLUMN     "shareExpiresAt" TIMESTAMP(3),
ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'private';

-- AlterTable
ALTER TABLE "SnippetCollectionItem" ADD COLUMN     "filePath" TEXT;

-- CreateTable
CREATE TABLE "SnippetVersion" (
    "id" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "public" BOOLEAN NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnippetVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnippetVariable" (
    "id" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "defaultValue" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnippetVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookRun" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaybookRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaybookRunItem" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "collectionItemId" TEXT,
    "snippetId" TEXT,
    "position" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PlaybookRunItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnippetUsageEvent" (
    "id" TEXT NOT NULL,
    "snippetId" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SnippetUsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiGeneratedDoc" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "codeHash" TEXT,
    "model" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiGeneratedDoc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SnippetVersion_snippetId_createdAt_idx" ON "SnippetVersion"("snippetId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SnippetVersion_snippetId_version_key" ON "SnippetVersion"("snippetId", "version");

-- CreateIndex
CREATE INDEX "SnippetVariable_snippetId_idx" ON "SnippetVariable"("snippetId");

-- CreateIndex
CREATE UNIQUE INDEX "SnippetVariable_snippetId_name_key" ON "SnippetVariable"("snippetId", "name");

-- CreateIndex
CREATE INDEX "PlaybookRun_userId_createdAt_idx" ON "PlaybookRun"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlaybookRun_collectionId_idx" ON "PlaybookRun"("collectionId");

-- CreateIndex
CREATE INDEX "PlaybookRunItem_runId_position_idx" ON "PlaybookRunItem"("runId", "position");

-- CreateIndex
CREATE INDEX "SnippetUsageEvent_snippetId_createdAt_idx" ON "SnippetUsageEvent"("snippetId", "createdAt");

-- CreateIndex
CREATE INDEX "SnippetUsageEvent_userId_createdAt_idx" ON "SnippetUsageEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SnippetUsageEvent_eventType_createdAt_idx" ON "SnippetUsageEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AiGeneratedDoc_targetType_targetId_idx" ON "AiGeneratedDoc"("targetType", "targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Snippet_shareToken_key" ON "Snippet"("shareToken");

-- CreateIndex
CREATE INDEX "Snippet_userId_createdAt_idx" ON "Snippet"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Snippet_visibility_idx" ON "Snippet"("visibility");

-- CreateIndex
CREATE INDEX "Snippet_pinned_createdAt_idx" ON "Snippet"("pinned", "createdAt");

-- CreateIndex
CREATE INDEX "Snippet_favorite_idx" ON "Snippet"("favorite");

-- CreateIndex
CREATE UNIQUE INDEX "SnippetCollection_shareToken_key" ON "SnippetCollection"("shareToken");

-- CreateIndex
CREATE INDEX "SnippetCollection_visibility_idx" ON "SnippetCollection"("visibility");

-- AddForeignKey
ALTER TABLE "Snippet" ADD CONSTRAINT "Snippet_forkedFromId_fkey" FOREIGN KEY ("forkedFromId") REFERENCES "Snippet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnippetVersion" ADD CONSTRAINT "SnippetVersion_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnippetVariable" ADD CONSTRAINT "SnippetVariable_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookRun" ADD CONSTRAINT "PlaybookRun_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "SnippetCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookRun" ADD CONSTRAINT "PlaybookRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaybookRunItem" ADD CONSTRAINT "PlaybookRunItem_runId_fkey" FOREIGN KEY ("runId") REFERENCES "PlaybookRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnippetUsageEvent" ADD CONSTRAINT "SnippetUsageEvent_snippetId_fkey" FOREIGN KEY ("snippetId") REFERENCES "Snippet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
