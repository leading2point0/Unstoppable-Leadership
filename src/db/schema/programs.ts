import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { users } from "./auth";
import { cohorts } from "./orgs";
import { challengeLevelEnum, moduleProgressStatusEnum, programStatusEnum } from "./enums";

/**
 * A participant's run of the ten-week program. Module *content* lives in
 * src/content/modules (versioned in code); this table tracks the
 * participant's instance, personalization, and pacing.
 */
export const programs = pgTable("programs", {
  id: idColumn(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cohortId: uuid("cohort_id").references(() => cohorts.id, { onDelete: "set null" }),
  title: text("title").notNull().default("Unstoppable Action Lab: Ten-Week Program"),
  displayName: text("display_name"),
  primaryReason: text("primary_reason"),
  usageType: text("usage_type").notNull().default("individual"), // individual | leadership-team
  startDate: date("start_date").notNull(),
  preferredReviewDay: integer("preferred_review_day").notNull().default(5), // 0=Sun .. 6=Sat
  reminderTime: time("reminder_time"),
  primaryLifeArea: text("primary_life_area"),
  currentGoal: text("current_goal"),
  challengeLevel: challengeLevelEnum("challenge_level").notNull().default("serious"),
  status: programStatusEnum("status").notNull().default("active"),
  currentModuleIndex: integer("current_module_index").notNull().default(1),
  contentVersion: text("content_version").notNull().default("1.0.0"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  isDemo: boolean("is_demo").notNull().default(false),
  ...timestamps,
});

export const programEnrollments = pgTable(
  "program_enrollments",
  {
    id: idColumn(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
    ...timestamps,
  },
  (table) => [uniqueIndex("program_enrollments_unique_idx").on(table.programId, table.userId)],
);

/** Lightweight registry of module metadata/version, mirroring src/content/modules. */
export const modules = pgTable(
  "modules",
  {
    id: idColumn(),
    slug: text("slug").notNull(),
    weekNumber: integer("week_number").notNull(),
    title: text("title").notNull(),
    contentVersion: text("content_version").notNull().default("1.0.0"),
    isPublished: boolean("is_published").notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex("modules_slug_idx").on(table.slug)],
);

export const moduleProgress = pgTable(
  "module_progress",
  {
    id: idColumn(),
    programId: uuid("program_id")
      .notNull()
      .references(() => programs.id, { onDelete: "cascade" }),
    moduleSlug: text("module_slug").notNull(),
    status: moduleProgressStatusEnum("status").notNull().default("available"),
    learnCompletedAt: timestamp("learn_completed_at", { withTimezone: true }),
    assessCompletedAt: timestamp("assess_completed_at", { withTimezone: true }),
    applyCompletedAt: timestamp("apply_completed_at", { withTimezone: true }),
    scheduleCompletedAt: timestamp("schedule_completed_at", { withTimezone: true }),
    trackCompletedAt: timestamp("track_completed_at", { withTimezone: true }),
    reflectCompletedAt: timestamp("reflect_completed_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    contentVersionAtCompletion: text("content_version_at_completion"),
    ...timestamps,
  },
  (table) => [uniqueIndex("module_progress_unique_idx").on(table.programId, table.moduleSlug)],
);
