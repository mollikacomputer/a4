/*
  Warnings:

  - The primary key for the `availability_slots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `service_categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `technician_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "availability_slots" DROP CONSTRAINT "availability_slots_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_service_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_category_id_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_technician_id_fkey";

-- DropForeignKey
ALTER TABLE "technician_profiles" DROP CONSTRAINT "technician_profiles_user_id_fkey";

-- AlterTable
ALTER TABLE "availability_slots" DROP CONSTRAINT "availability_slots_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "technician_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "availability_slots_id_seq";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customer_id" SET DATA TYPE TEXT,
ALTER COLUMN "technician_id" SET DATA TYPE TEXT,
ALTER COLUMN "service_id" SET DATA TYPE TEXT,
ALTER COLUMN "slot_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "bookings_id_seq";

-- AlterTable
ALTER TABLE "payments" DROP CONSTRAINT "payments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "booking_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "payments_id_seq";

-- AlterTable
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "booking_id" SET DATA TYPE TEXT,
ALTER COLUMN "customer_id" SET DATA TYPE TEXT,
ALTER COLUMN "technician_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "reviews_id_seq";

-- AlterTable
ALTER TABLE "service_categories" DROP CONSTRAINT "service_categories_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "service_categories_id_seq";

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "technician_id" SET DATA TYPE TEXT,
ALTER COLUMN "category_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "services_id_seq";

-- AlterTable
ALTER TABLE "technician_profiles" DROP CONSTRAINT "technician_profiles_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "technician_profiles_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "technician_profiles_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "availability_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "technician_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
