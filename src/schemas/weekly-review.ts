import { z } from "zod";

export const weeklyReviewSchema = z.object({
  programId: z.string().uuid(),
  weekNumber: z.coerce.number().int().min(1).max(10),
  moduleSlug: z.string().min(1),
  measurableResult: z.string().max(1000).optional(),
  actionsCompleted: z.string().max(1000).optional(),
  actionsAvoided: z.string().max(1000).optional(),
  explanationGiven: z.string().max(1000).optional(),
  explanationValidity: z.enum(["valid", "incomplete", "excuse"]).optional(),
  lesson: z.string().max(1000).optional(),
  continueDoing: z.string().max(500).optional(),
  stopDoing: z.string().max(500).optional(),
  changeGoing: z.string().max(500).optional(),
  nextWeekPriority: z.string().min(1, "Name next week's most important action.").max(500),
  biggestWin: z.string().max(500).optional(),
  mainObstacle: z.string().max(500).optional(),
});
export type WeeklyReviewInput = z.infer<typeof weeklyReviewSchema>;

export const WEEKLY_REVIEW_QUESTIONS = [
  { id: "measurableResult", prompt: "What measurable result did I produce?" },
  { id: "actionsCompleted", prompt: "Which planned actions did I complete?" },
  { id: "actionsAvoided", prompt: "Which actions did I avoid?" },
  { id: "explanationGiven", prompt: "What explanation am I giving myself?" },
  { id: "explanationValidity", prompt: "Is that explanation valid, incomplete, or an excuse?" },
  { id: "lesson", prompt: "What did I learn?" },
  { id: "continueDoing", prompt: "What should I continue?" },
  { id: "stopDoing", prompt: "What should I stop?" },
  { id: "changeGoing", prompt: "What should I change?" },
  { id: "nextWeekPriority", prompt: "What is next week's most important action?" },
] as const;
