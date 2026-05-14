import "dotenv/config";
import { prisma } from "@repo/db";
import cron from "node-cron";
import cronParser from "cron-parser";

console.log("Scheduler started");

function getNextRunAt(cronExp: string): Date {
  const interval = cronParser.parseExpression(cronExp);
  return interval.next().toDate();
}

// Runs every minute — checks which cron triggers are due
cron.schedule("* * * * *", async () => {
  console.log("Checking for due cron triggers...");

  const now = new Date();

  const dueTriggers = await prisma.cronTrigger.findMany({
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

  if (dueTriggers.length === 0) {
    console.log("No triggers due");
    return;
  }

  console.log(`Found ${dueTriggers.length} due triggers`);

  for (const trigger of dueTriggers) {
    await prisma.$transaction(async (tx) => {
      const flow = await tx.tideFlow.create({
        data: {
          tideId: trigger.tideId,
          metadata: { source: "cron", cronExp: trigger.cronExp },
        },
      });

      await tx.tideFlowOutbox.create({
        data: {
          tideFlowId: flow.id,
        },
      });

      await tx.cronTrigger.update({
        where: { id: trigger.id },
        data: {
          lastRunAt: now,
          nextRunAt: getNextRunAt(trigger.cronExp),
        },
      });

      console.log(`Fired cron trigger for tide: ${trigger.tideId}`);
    });
  }
});
