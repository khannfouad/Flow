-- CreateEnum
CREATE TYPE "Staus" AS ENUM ('ACTIVE', 'PAUSED', 'DELAYED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tide" (
    "id" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "currentStatus" "Staus" NOT NULL DEFAULT 'ACTIVE',
    "createdAtt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" TEXT NOT NULL,
    "tideId" TEXT NOT NULL,
    "triggerId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" TEXT NOT NULL,
    "tideId" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "sortingOrder" INTEGER NOT NULL DEFAULT 0,
    "trueStep" INTEGER NOT NULL DEFAULT 0,
    "falseStep" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableAction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableTriggers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvailableTriggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TideFlow" (
    "id" TEXT NOT NULL,
    "tideId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "TideFlow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TideFlowOutbox" (
    "id" TEXT NOT NULL,
    "tideFlowId" TEXT NOT NULL,

    CONSTRAINT "TideFlowOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trigger_tideId_key" ON "Trigger"("tideId");

-- CreateIndex
CREATE UNIQUE INDEX "TideFlowOutbox_tideFlowId_key" ON "TideFlowOutbox"("tideFlowId");

-- AddForeignKey
ALTER TABLE "Tide" ADD CONSTRAINT "Tide_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvailableTriggers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "AvailableAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TideFlow" ADD CONSTRAINT "TideFlow_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TideFlowOutbox" ADD CONSTRAINT "TideFlowOutbox_tideFlowId_fkey" FOREIGN KEY ("tideFlowId") REFERENCES "TideFlow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
