/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_payment_intent_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_fkey";

-- DropIndex
DROP INDEX "payments_stripeCustomerId_idx";

-- DropIndex
DROP INDEX "payments_stripe_payment_intent_id_key";

-- DropIndex
DROP INDEX "payments_user_id_idx";

-- DropIndex
DROP INDEX "users_stripe_customer_id_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "stripe_payment_intent_id",
DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_customer_id",
ADD COLUMN     "stripeCustomerId" TEXT;
