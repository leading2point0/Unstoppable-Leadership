import { z } from "zod";

export const createHabitSchema = z.object({
  programId: z.string().uuid(),
  name: z.string().min(1, "Name this habit.").max(150),
  reason: z.string().max(500).optional(),
  trigger: z.string().max(200).optional(),
  behavior: z.string().max(200).optional(),
  reward: z.string().max(200).optional(),
  frequency: z.enum(["daily", "weekdays", "weekly"]).default("daily"),
  minimumVersion: z.string().max(200).optional(),
  targetVersion: z.string().max(200).optional(),
  startDate: z.string().min(1),
});
export type CreateHabitInput = z.infer<typeof createHabitSchema>;

export const logHabitEntrySchema = z.object({
  habitId: z.string().uuid(),
  programId: z.string().uuid(),
  entryDate: z.string().min(1),
  completed: z.coerce.boolean(),
  usedMinimumVersion: z.coerce.boolean().default(false),
  notes: z.string().max(500).optional(),
});
export type LogHabitEntryInput = z.infer<typeof logHabitEntrySchema>;
