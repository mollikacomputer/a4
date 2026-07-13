-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CLEANING', 'PAINTING', 'PLUMBING', 'ELECTRICAL');

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_category_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_technician_id_fkey";

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "technician_id" DROP NOT NULL,
ALTER COLUMN "category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "technician_profiles" ALTER COLUMN "experience_years" SET DEFAULT 2;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technician_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
