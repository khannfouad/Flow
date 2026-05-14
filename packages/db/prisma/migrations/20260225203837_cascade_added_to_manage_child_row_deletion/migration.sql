-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_tideId_fkey";

-- DropForeignKey
ALTER TABLE "TideFlow" DROP CONSTRAINT "TideFlow_tideId_fkey";

-- DropForeignKey
ALTER TABLE "TideFlowOutbox" DROP CONSTRAINT "TideFlowOutbox_tideFlowId_fkey";

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_tideId_fkey";

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TideFlow" ADD CONSTRAINT "TideFlow_tideId_fkey" FOREIGN KEY ("tideId") REFERENCES "Tide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TideFlowOutbox" ADD CONSTRAINT "TideFlowOutbox_tideFlowId_fkey" FOREIGN KEY ("tideFlowId") REFERENCES "TideFlow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
