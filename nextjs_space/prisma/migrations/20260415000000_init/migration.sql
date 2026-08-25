-- Baseline migration.
--
-- The original Product and ContactSubmission tables were created with
-- `prisma db push`, which records nothing in _prisma_migrations. The next
-- migration (20260416000000_add_series_orders) therefore ran ALTER TABLE
-- "Product" against a table no migration had ever created, so
-- `prisma migrate deploy` failed on any fresh database — including production.
-- This migration creates that original state so the chain applies cleanly.

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('LIVRE', 'FORMATION');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "type" "ProductType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'nouveau',

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);
