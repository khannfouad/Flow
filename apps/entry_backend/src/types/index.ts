import { z } from "zod";

export const SignupData = z.object({
  name: z.string(),
  username: z.string().min(6),
  password: z.string().min(8),
});

export const SigninData = z.object({
  username: z.string(),
  password: z.string(),
});

export const tideCreateSchema = z.object({
  availableTriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetaData: z.any().optional(),
    }),
  ),
});

export const cronTideCreateSchema = z.object({
  cronExp: z.string(),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetaData: z.any().optional(),
    }),
  ),
});
