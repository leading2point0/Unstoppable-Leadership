import { z } from "zod";

export const operatingSystemSchema = z.object({
  programId: z.string().uuid(),
  identityStatement: z.string().max(500).optional(),
  primaryGoal: z
    .object({
      goal: z.string().max(300),
      deadline: z.string().max(100),
      baseline: z.string().max(200),
      target: z.string().max(200),
      leadMeasure: z.string().max(200),
    })
    .optional(),
  bigThree: z.array(z.string().max(200)).max(3).default([]),
  dailyNonNegotiables: z.array(z.string().max(200)).max(5).default([]),
  weeklyReviewQuestions: z.array(z.string().max(300)).max(10).default([]),
  decisionFilter: z.array(z.string().max(200)).max(5).default([]),
  setbackProtocol: z.array(z.string().max(300)).max(10).default([]),
  leadershipCommitments: z
    .object({
      expectations: z.string().max(300),
      accountability: z.string().max(300),
      support: z.string().max(300),
      feedback: z.string().max(300),
      recognition: z.string().max(300),
    })
    .optional(),
  habitArchitecture: z
    .object({
      morning: z.string().max(300),
      workStart: z.string().max(300),
      shutdown: z.string().max(300),
      health: z.string().max(300),
      relationships: z.string().max(300),
      learning: z.string().max(300),
    })
    .optional(),
});
export type OperatingSystemInput = z.infer<typeof operatingSystemSchema>;

export const DEFAULT_WEEKLY_REVIEW_QUESTIONS = [
  "What measurable result did I produce?",
  "Which planned actions did I complete?",
  "Which actions did I avoid, and why?",
  "What did I learn?",
  "What should I continue?",
  "What should I stop?",
  "What is next week's most important action?",
];

export const DEFAULT_DECISION_FILTER = [
  "Does this serve my primary twelve-month goal or one of my Big Three?",
  "What would I have to say no to in order to say yes to this?",
  "Would the person I'm becoming accept this commitment?",
  "Is this urgent, important, or merely loud?",
  "What is the real cost if I decline?",
];
