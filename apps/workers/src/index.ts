import { Kafka } from "kafkajs";
import { prisma } from "@repo/db";

const TOPIC_NAME = "flow-events";

const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "main-worker" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });

      if (!message.value?.toString()) {
        await consumer.commitOffsets([
          {
            topic: TOPIC_NAME,
            partition,
            offset: String(Number(message.offset) + 1),
          },
        ]);
        return;
      }

      const parsedValue = JSON.parse(message.value.toString());
      const tideFlowId = parsedValue.tideFlowId;
      const stage = parsedValue.stage;

      const tideFlowDetails = await prisma.tideFlow.findFirst({
        where: { id: tideFlowId },
        include: {
          tide: {
            include: {
              actions: {
                include: { type: true },
              },
            },
          },
        },
      });

      const currentAction = tideFlowDetails?.tide.actions.find(
        (x) => x.sortingOrder === stage,
      );

      if (!currentAction) {
        console.log("Current action does not exist!!");
        await consumer.commitOffsets([
          {
            topic: TOPIC_NAME,
            partition,
            offset: String(Number(message.offset) + 1),
          },
        ]);
        return;
      }

      try {
        if (currentAction.type.id === "email") {
          const to = "youremail@gmail.com"; // hardcode for now
          const body = "Tide triggered successfully!"; // hardcode for now
          console.log(`Sending email to ${to}`);

          // await sendEmail(to, body);
        }

        if (currentAction.type.id === "solana") {
          console.log(`Sending SOL to`);
          // await sendSol(address, amount);
        }
      } catch (e) {
        console.error("Action failed:", e);
      }

      await new Promise((stop) => setTimeout(stop, 2000));

      const lastStage = (tideFlowDetails?.tide.actions?.length || 1) - 1;

      if (lastStage !== stage) {
        await producer.send({
          topic: TOPIC_NAME,
          messages: [
            {
              value: JSON.stringify({
                stage: stage + 1,
                tideFlowId,
              }),
            },
          ],
        });
      }

      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition,
          offset: String(Number(message.offset) + 1),
        },
      ]);
    },
  });
}

main();
