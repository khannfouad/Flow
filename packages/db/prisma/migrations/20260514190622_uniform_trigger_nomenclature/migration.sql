/*
  Warnings:

  - You are about to drop the `CronTrigger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CronTrigger" DROP CONSTRAINT "CronTrigger_tideId_fkey";

-- DropTable
DROP TABLE "CronTrigger";

-- CreateTable
CREATE TABLE "Cron" (
    "id" TEXT NOT NULL,
    "tideId" TEXT NOT NULL,
    "cronExp" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cron_tideId_key" ON "Cron"("tideId");

-- AddForeignKey
ALTER TABLE "Cron" ADD CONSTRAINT "Cron_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
