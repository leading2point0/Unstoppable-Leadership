import { z } from "zod";

export const challengeLevelValues = ["foundation", "serious", "intensive"] as const;

export const createProgramSchema = z.object({
  displayName: z.string().min(1, "Enter a preferred name.").max(120),
  primaryReason: z.string().max(500).optional(),
  usageType: z.enum(["individual", "leadership-team"]).default("individual"),
  startDate: z.string().min(1, "Choose a start date."),
  preferredReviewDay: z.coerce.number().int().min(0).max(6).default(5),
  reminderTime: z.string().optional(),
  primaryLifeArea: z.string().max(120).optional(),
  currentGoal: z.string().max(500).optional(),
  challengeLevel: z.enum(challengeLevelValues).default("serious"),
});
export type CreateProgramInput = z.infer<typeof createProgramSchema>;

export const updateProgramSchema = createProgramSchema.partial().extend({
  status: z.enum(["active", "completed", "paused", "abandoned"]).optional(),
  currentModuleIndex: z.coerce.number().int().min(1).max(10).optional(),
});
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
