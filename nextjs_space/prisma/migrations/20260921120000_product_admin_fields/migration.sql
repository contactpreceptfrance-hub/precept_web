-- Book management from /admin: hide a title, mark it sold out, order it within
-- its series.

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "soldOut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill sortOrder from the order the shop already displays (createdAt asc
-- within each series), so nothing moves on the public pages. Products with no
-- series share one partition, matching how they are grouped as "Autres".
UPDATE "Product" p
SET "sortOrder" = r.rn
FROM (
  SELECT "id", ROW_NUMBER() OVER (
    PARTITION BY COALESCE("series", '')
    ORDER BY "createdAt", "id"
  ) AS rn
  FROM "Product"
) r
WHERE p."id" = r."id";
