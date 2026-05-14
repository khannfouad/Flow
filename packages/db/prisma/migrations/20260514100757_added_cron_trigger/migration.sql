-- CreateTable
CREATE TABLE "CronTrigger" (
    "id" TEXT NOT NULL,
    "tideId" TEXT NOT NULL,
    "cronExp" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronTrigger_tideId_key" ON "CronTrigger"("tideId");

-- AddForeignKey
ALTER TABLE "CronTrigger" ADD CONSTRAINT "CronTrigger_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE CASCADE ON UPDATE CASCADE;
