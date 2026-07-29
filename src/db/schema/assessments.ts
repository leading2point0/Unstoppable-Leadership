import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { programs } from "./programs";

/** One self-assessment snapshot for a module (a program may retake it). */
export const assessments = pgTable("assessments", {
  id: idColumn(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  moduleSlug: text("module_slug").notNull(),
  takenAt: timestamp("taken_at", { withTimezone: true }).notNull().defaultNow(),
  currentScoreAverage: numeric("current_score_average", { precision: 4, scale: 2 }),
  desiredScoreAverage: numeric("desired_score_average", { precision: 4, scale: 2 }),
  largestGapQuestionId: text("largest_gap_question_id"),
  recommendedFocus: text("recommended_focus"),
  ...timestamps,
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: idColumn(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  currentScore: integer("current_score").notNull(),
  desiredScore: integer("desired_score").notNull(),
  ...timestamps,
});
