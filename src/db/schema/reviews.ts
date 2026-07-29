import { integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { programs } from "./programs";

export const weeklyReviews = pgTable(
  "weekly_reviews",
  {
    id: idColumn(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    weekNumber: integer("week_number").notNull(),
    moduleSlug: text("module_slug").notNull(),
    measurableResult: text("measurable_result"),
    actionsCompleted: text("actions_completed"),
    actionsAvoided: text("actions_avoided"),
    explanationGiven: text("explanation_given"),
    explanationValidity: text("explanation_validity"), // valid | incomplete | excuse
    lesson: text("lesson"),
    continueDoing: text("continue_doing"),
    stopDoing: text("stop_doing"),
    changeGoing: text("change_going"),
    nextWeekPriority: text("next_week_priority"),
    biggestWin: text("biggest_win"),
    mainObstacle: text("main_obstacle"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [uniqueIndex("weekly_reviews_unique_idx").on(table.programId, table.weekNumber)],
);

export const scorecards = pgTable(
  "scorecards",
  {
    id: idColumn(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    weekNumber: integer("week_number").notNull(),
    conceptReviewPoint: integer("concept_review_point").notNull().default(0),
    selfAssessmentPoint: integer("self_assessment_point").notNull().default(0),
    actionsPlannedPoint: integer("actions_planned_point").notNull().default(0),
    actionsScheduledPoint: integer("actions_scheduled_point").notNull().default(0),
    difficultActionPoints: integer("difficult_action_points").notNull().default(0),
    leadMeasurePoint: integer("lead_measure_point").notNull().default(0),
    evidencePoint: integer("evidence_point").notNull().default(0),
    weeklyReviewPoint: integer("weekly_review_point").notNull().default(0),
    nextWeekCommitmentPoint: integer("next_week_commitment_point").notNull().default(0),
    totalScore: integer("total_score").notNull().default(0),
    ...timestamps,
  },
  (table) => [uniqueIndex("scorecards_unique_idx").on(table.programId, table.weekNumber)],
);

export const operatingSystems = pgTable("operating_systems", {
  id: idColumn(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" })
    .unique(),
  identityStatement: text("identity_statement"),
  primaryGoal: jsonb("primary_goal").$type<{
    goal: string;
    deadline: string;
    baseline: string;
    target: string;
    leadMeasure: string;
  }>(),
  bigThree: jsonb("big_three").$type<string[]>().default([]),
  dailyNonNegotiables: jsonb("daily_non_negotiables").$type<string[]>().default([]),
  weeklyReviewQuestions: jsonb("weekly_review_questions").$type<string[]>().default([]),
  decisionFilter: jsonb("decision_filter").$type<string[]>().default([]),
  setbackProtocol: jsonb("setback_protocol").$type<string[]>().default([]),
  leadershipCommitments: jsonb("leadership_commitments").$type<{
    expectations: string;
    accountability: string;
    support: string;
    feedback: string;
    recognition: string;
  }>(),
  habitArchitecture: jsonb("habit_architecture").$type<{
    morning: string;
    workStart: string;
    shutdown: string;
    health: string;
    relationships: string;
    learning: string;
  }>(),
  finalizedAt: timestamp("finalized_at", { withTimezone: true }),
  ...timestamps,
});
