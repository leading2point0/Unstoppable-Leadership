import { boolean, date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { programs } from "./programs";
import { actionStatusEnum, recurrenceEnum } from "./enums";

export const implementationActions = pgTable("implementation_actions", {
  id: idColumn(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  moduleSlug: text("module_slug"),
  stepIndex: integer("step_index"),
  title: text("title").notNull(),
  description: text("description"),
  reason: text("reason"),
  nextPhysicalAction: text("next_physical_action"),
  importance: text("importance").notNull().default("important"), // urgent-important | important | low-value
  estimatedEffortMinutes: integer("estimated_effort_minutes"),
  status: actionStatusEnum("status").notNull().default("not-started"),
  blocker: text("blocker"),
  dueDate: date("due_date"),
  dueTime: text("due_time"),
  recurrence: recurrenceEnum("recurrence").notNull().default("none"),
  contextOrLocation: text("context_or_location"),
  trigger: text("trigger"),
  reminderText: text("reminder_text"),
  isDifficultAction: boolean("is_difficult_action").notNull().default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  ...timestamps,
});

export const actionEvidence = pgTable("action_evidence", {
  id: idColumn(),
  actionId: uuid("action_id")
    .notNull()
    .references(() => implementationActions.id, { onDelete: "cascade" }),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  completionDate: date("completion_date").notNull(),
  fileName: text("file_name"),
  fileObjectKey: text("file_object_key"),
  notes: text("notes"),
  outcomeRating: integer("outcome_rating"),
  ...timestamps,
});
