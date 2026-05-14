import { prisma } from "@repo/db";
import { Kafka } from "kafkajs";

const TOPIC_NAME = "flow-events";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

console.log("control reached here");

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (true) {
    const pendingRows = await prisma.tideFlowOutbox.findMany({
      where: {},
      take: 10,
    });

    await producer.send({
      topic: TOPIC_NAME,
      messages: pendingRows.map((row) => ({
        value: JSON.stringify({ tideFlowId: row.tideFlowId, stage: 0 }),
      })),
    });

    await prisma.tideFlowOutbox.deleteMany({
      where: {
        id: {
          in: pendingRows.map((row) => row.id),
        },
      },
    });

    await new Promise((r) => setTimeout(r, 3000));
  }
}

main();
