import { z } from "zod";

export const sharingLevelValues = [
  "private",
  "completion-only",
  "selected-response",
  "shared-with-facilitator",
] as const;

export const createJournalEntrySchema = z.object({
  programId: z.string().uuid(),
  moduleSlug: z.string().optional(),
  entryDate: z.string().min(1),
  mode: z.enum(["standard", "ruthless-review"]).default("standard"),
  wins: z.string().max(2000).optional(),
  resistance: z.string().max(2000).optional(),
  lessons: z.string().max(2000).optional(),
  decisions: z.string().max(2000).optional(),
  followUpAction: z.string().max(500).optional(),
  moodRating: z.coerce.number().int().min(1).max(5).optional(),
  energyRating: z.coerce.number().int().min(1).max(5).optional(),
  tags: z.array(z.string().max(40)).max(10).default([]),
  body: z.string().max(5000).optional(),
  sharingLevel: z.enum(sharingLevelValues).default("private"),
});
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;

export const RUTHLESS_REVIEW_PROMPTS = [
  "What am I pretending not to know?",
  "Where am I choosing comfort over progress?",
  "What result proves whether I improved?",
  "What am I blaming that remains partly within my control?",
  "Which commitment should be eliminated?",
  "What conversation am I avoiding?",
  "What would disciplined action look like today?",
] as const;
