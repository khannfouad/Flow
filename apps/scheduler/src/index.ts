import "dotenv/config";
import { prisma } from "@repo/db";
import cron from "node-cron";
import cronParser from "cron-parser";

console.log("Scheduler started");

function getNextRunAt(cronExp: string): Date {
  const interval = cronParser.parseExpression(cronExp);
  return interval.next().toDate();
}

// Minute trigger runs every minute
cron.schedule("* * * * *", async () => {
  console.log("Checking for due cron triggers...");
  const now = new Date();
  console.log("Current time:", now.toISOString());

  try {
    const triggerLeft = await prisma.cron.findMany({
      where: {
        nextRunAt: {
          lte: now,
        },
        tide: {
          currentStatus: "ACTIVE",
        },
      },
      include: {
        tide: true,
      },
    });

    console.log("triggers found => ", triggerLeft.length);

    if (triggerLeft.length === 0) {
      console.log("No triggers reamaining");
      return;
    }

    for (const trigger of triggerLeft) {
      await prisma.$transaction(async (tx) => {
        const flow = await tx.tideFlow.create({
          data: {
            tideId: trigger.tideId,
            metadata: { source: "cron", cronExp: trigger.cronExp },
          },
        });

        await tx.tideFlowOutbox.create({
          data: { tideFlowId: flow.id },
        });

        await tx.cron.update({
          where: { id: trigger.id },
          data: {
            lastRunAt: now,
            nextRunAt: getNextRunAt(trigger.cronExp),
          },
        });

        console.log(`Fired cron trigger for tide: ${trigger.tideId}`);
      });
    }
  } catch (e) {
    console.error("Cron gives error = ", e);
  }
});
