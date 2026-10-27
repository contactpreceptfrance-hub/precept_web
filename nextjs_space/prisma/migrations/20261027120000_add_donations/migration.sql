-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeInvoiceId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "donorEmail" TEXT,
    "donorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_stripeSessionId_key" ON "Donation"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_stripeInvoiceId_key" ON "Donation"("stripeInvoiceId");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

-- CreateIndex
CREATE INDEX "Donation_recurring_createdAt_idx" ON "Donation"("recurring", "createdAt");
