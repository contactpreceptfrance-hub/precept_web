-- Optional stock count per book. NULL means "not tracked", which is what every
-- existing book gets, so nothing changes until the team enters a number.

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER;
