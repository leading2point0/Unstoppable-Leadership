import { z } from "zod";

export const actionStatusValues = [
  "not-started",
  "planned",
  "in-progress",
  "blocked",
  "completed",
  "abandoned-intentionally",
] as const;

export const recurrenceValues = [
  "none",
  "daily",
  "weekdays",
  "weekly",
  "biweekly",
  "monthly",
] as const;

export const createActionSchema = z.object({
  programId: z.string().uuid(),
  moduleSlug: z.string().optional(),
  stepIndex: z.coerce.number().int().optional(),
  title: z.string().min(1, "Give this action a title.").max(200),
  description: z.string().max(1000).optional(),
  reason: z.string().max(500).optional(),
  nextPhysicalAction: z.string().max(300).optional(),
  importance: z.enum(["urgent-important", "important", "low-value"]).default("important"),
  estimatedEffortMinutes: z.coerce.number().int().min(0).max(1000).optional(),
  dueDate: z.string().max(20).optional(),
  dueTime: z.string().max(20).optional(),
  recurrence: z.enum(recurrenceValues).default("none"),
  contextOrLocation: z.string().max(200).optional(),
  trigger: z.string().max(200).optional(),
  reminderText: z.string().max(200).optional(),
  isDifficultAction: z.coerce.boolean().default(false),
});
export type CreateActionInput = z.infer<typeof createActionSchema>;

export const updateActionSchema = createActionSchema.partial().extend({
  status: z.enum(actionStatusValues).optional(),
  blocker: z.string().max(500).optional(),
});
export type UpdateActionInput = z.infer<typeof updateActionSchema>;

export const actionEvidenceSchema = z.object({
  actionId: z.string().uuid(),
  programId: z.string().uuid(),
  description: z.string().min(1, "Describe what you actually did.").max(1000),
  completionDate: z.string().min(1),
  fileName: z.string().max(255).optional(),
  notes: z.string().max(1000).optional(),
  outcomeRating: z.coerce.number().int().min(1).max(5).optional(),
});
export type ActionEvidenceInput = z.infer<typeof actionEvidenceSchema>;
