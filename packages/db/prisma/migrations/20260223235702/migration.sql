/*
  Warnings:

  - The values [DELAYED] on the enum `Staus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Staus_new" AS ENUM ('ACTIVE', 'PAUSED');
ALTER TABLE "public"."Tide" ALTER COLUMN "currentStatus" DROP DEFAULT;
ALTER TABLE "Tide" ALTER COLUMN "currentStatus" TYPE "Staus_new" USING ("currentStatus"::text::"Staus_new");
ALTER TYPE "Staus" RENAME TO "Staus_old";
ALTER TYPE "Staus_new" RENAME TO "Staus";
DROP TYPE "public"."Staus_old";
ALTER TABLE "Tide" ALTER COLUMN "currentStatus" SET DEFAULT 'ACTIVE';
COMMIT;

-- CreateTable
CREATE TABLE "TideDraft" (
    "id" TEXT NOT NULL,
    "jsonData" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "TideDraft_pkey" PRIMARY KEY ("id")
);
