/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentPeriodEnd` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCustomerId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PAID';

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeCustomerId_key" ON "payments"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeSubscriptionId_key" ON "payments"("stripeSubscriptionId");
