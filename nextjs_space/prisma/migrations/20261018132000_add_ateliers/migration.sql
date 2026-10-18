-- CreateTable
CREATE TABLE "Atelier" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduleText" TEXT NOT NULL,
    "nextDate" TIMESTAMP(3),
    "durationMin" INTEGER NOT NULL DEFAULT 90,
    "leaderName" TEXT,
    "zoomUrl" TEXT NOT NULL,
    "zoomInfo" TEXT,
    "productId" TEXT,
    "customImageUrl" TEXT,
    "customPdfUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Atelier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Atelier_published_sortOrder_idx" ON "Atelier"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "Atelier_productId_idx" ON "Atelier"("productId");

-- AddForeignKey
ALTER TABLE "Atelier" ADD CONSTRAINT "Atelier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
