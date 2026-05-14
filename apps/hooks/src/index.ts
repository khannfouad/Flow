import express from "express";
import { prisma } from "@repo/db";
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:tideId", async (req, res) => {
  const userId = req.params.userId;
  const tideId = req.params.tideId;
  const body = req.body;

  await prisma.$transaction(async (tx) => {
    const flow = await tx.tideFlow.create({
      data: {
        tideId,
        metadata: body,
      },
    });

    console.log(flow.id);

    const outbox = await tx.tideFlowOutbox.create({
      data: {
        tideFlowId: flow.id,
      },
    });
    console.log(outbox.id);
  });
  res.json({
    message: "Webhook received",
  });
});

app.listen(3002, () => {
  console.log("SErver active", 3002);
});
