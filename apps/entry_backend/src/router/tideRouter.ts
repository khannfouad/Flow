import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { prisma } from "@repo/db";
import { tideCreateSchema } from "../types/index.js";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id: string = req.id;
  const body = req.body;
  console.log(body);

  const parsedData = tideCreateSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const tideId = await prisma.$transaction(async (tx) => {
    const tide = await prisma.tide.create({
      data: {
        userId: parseInt(id),
        triggerId: "",
        actions: {
          create: parsedData.data.actions.map((x, index) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
            metadata: x.actionMetaData,
          })),
        },
      },
    });

    const trigger = await tx.trigger.create({
      data: {
        triggerId: parsedData.data.availableTriggerId,
        tideId: tide.id,
      },
    });

    await tx.tide.update({
      where: {
        id: tide.id,
      },
      data: {
        triggerId: trigger.id,
      },
    });

    return tide.id;
  });

  return res.json({
    tideId,
  });
});

router.get("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id;
  const tides = await prisma.tide.findMany({
    where: {
      userId: id,
    },
    include: {
      actions: {
        include: {
          type: true,
        },
      },
      trigger: {
        include: {
          type: true,
        },
      },
    },
  });

  return res.json({
    tides,
  });
});

router.post("/draft", authMiddleware, async (req, res) => {
  const body = req.body;
  console.log(body);

  const parsedData = tideCreateSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const tideDraft = await prisma.$transaction(async (tx) => {
    await tx.tideDraft.create({
      data: {
        jsonData: parsedData.data,
      },
    });
  });

  return res.json({
    tideDraft,
  });
});

router.get("/:draftId/publish", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id: string = req.id;
  const draftId = req.params.draftId;
  const finalDraft = await prisma.tideDraft.findUnique({
    //@ts-ignore
    where: { id: draftId },
  });
  //@ts-ignore
  const parsedData = finalDraft.jsonData as {
    availableTriggerId: string;
    triggerMetadata: any;
    actions: {
      availableActionId: string;
      actionMetaData: any;
    }[];
  };

  console.log(parsedData);

  const tideId = await prisma.$transaction(async (tx) => {
    const tide = await tx.tide.create({
      data: {
        userId: parseInt(id),
        triggerId: "",
        actions: {
          create: parsedData.actions.map((x: any, index: number) => ({
            actionId: x.availableActionId,
            sortingOrder: index,
            metadata: x.actionMetaData,
          })),
        },
      },
    });

    const trigger = await tx.trigger.create({
      data: {
        triggerId: parsedData.availableTriggerId,
        tideId: tide.id,
      },
    });

    await tx.tide.update({
      where: {
        id: tide.id,
      },
      data: {
        triggerId: trigger.id,
      },
    });

    return tide.id;
  });

  return res.json({
    tideId,
  });
});

/////////////////////////////////////////////////////////// this is a dynamic route
// router.get("/:tideId", authMiddleware, async (req, res) => {
//   //@ts-ignore
//   const id = req.id;
//   const tideId = req.params.tideId;

//   const tide = await prisma.tide.findFirst({
//     where: {
//       //@ts-ignore
//       id: tideId,
//       userId: id,
//     },
//     include: {
//       actions: {
//         include: {
//           type: true,
//         },
//       },
//       trigger: {
//         include: {
//           type: true,
//         },
//       },
//     },
//   });

//   return res.json({
//     tide,
//   });
// });
/////////////////////////////////////////////////////////

// I have started working on this file part 1 3.53 - 1.38

//api pause

router.get("/:tideId/pause", async (req, res) => {
  const tideId = req.params.tideId;
  await prisma.tide.update({
    where: {
      id: tideId,
    },
    data: {
      currentStatus: "PAUSED",
    },
  });

  res.json(tideId);
  return;
});

//api resume
router.get("/:tideId/resume", async (req, res) => {
  const tideId = req.params.tideId;
  await prisma.tide.update({
    where: {
      id: tideId,
    },
    data: {
      currentStatus: "ACTIVE",
    },
  });
  res.json(tideId);
  return;
});

// soft deletion for me to undo deletion if need be
router.get("/:tideId/delete", async (req, res) => {
  const tideId = req.params.tideId;
  await prisma.tide.update({
    where: {
      id: tideId,
    },
    data: {
      currentStatus: "DELETED",
    },
  });
  res.json(tideId);
  return;
});

//api hard delete
router.get("/:tideId/hard/delete/", async (req, res) => {
  const tideId = req.params.tideId;
  await prisma.tide.delete({
    where: {
      id: tideId,
    },
  });

  res.json(tideId + " deleted");

  return;
});

router.post("/:tideId/webhook", async (req, res) => {
  const tideId = req.params.tideId;
  const body = req.body;

  try {
    await prisma.$transaction(async (tx) => {
      const tideFlow = await tx.tideFlow.create({
        data: {
          tideId,
          metadata: body,
        },
      });

      await tx.tideFlowOutbox.create({
        data: {
          tideFlowId: tideFlow.id,
        },
      });
    });

    return res.json({ message: "Tide triggered" });
  } catch (e) {
    console.error("Webhook transaction failed:", e);
    return res.status(500).json({ error: e });
  }
});

export const tideRouter = router;
