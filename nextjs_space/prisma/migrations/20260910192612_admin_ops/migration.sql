-- Admin operations groundwork: shipping address, order-line name snapshot,
-- contact triage, and the rate-limit table.
--
-- The CREATE INDEX statements below take a brief write lock. That is safe here
-- because these tables hold tens of rows, not millions; revisit with CREATE
-- INDEX CONCURRENTLY (which cannot run inside a transaction, so it needs its
-- own migration) if the order volume ever makes that lock noticeable.

-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN     "handledAt" TIMESTAMP(3),
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'contact';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAddress" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productName" TEXT;

-- Backfill the snapshot from today's product names, so existing orders are not
-- left half-populated. This is the best value available: the name at the time
-- of sale was not recorded, and ON DELETE RESTRICT on OrderItem_productId_fkey
-- guarantees every row still has a product to read it from.
UPDATE "OrderItem" oi
SET "productName" = p."name"
FROM "Product" p
WHERE p."id" = oi."productId";

-- CreateTable
CREATE TABLE "RateLimitHit" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimitHit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimitHit_bucket_ipHash_createdAt_idx" ON "RateLimitHit"("bucket", "ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "RateLimitHit_createdAt_idx" ON "RateLimitHit"("createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_handledAt_createdAt_idx" ON "ContactSubmission"("handledAt", "createdAt");

-- CreateIndex
CREATE INDEX "ContactSubmission_source_createdAt_idx" ON "ContactSubmission"("source", "createdAt");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
