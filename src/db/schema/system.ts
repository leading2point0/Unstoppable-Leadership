import { boolean, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { users } from "./auth";
import { exportFormatEnum, exportScopeEnum } from "./enums";

export const userPreferences = pgTable("user_preferences", {
  id: idColumn(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  theme: text("theme").notNull().default("system"), // light | dark | system
  reduceMotion: boolean("reduce_motion").notNull().default(false),
  weeklyReviewDay: text("weekly_review_day").notNull().default("friday"),
  reminderTime: text("reminder_time"),
  emailNotifications: boolean("email_notifications").notNull().default(false),
  ...timestamps,
});

export const auditEvents = pgTable("audit_events", {
  id: idColumn(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: text("target_id"),
  details: jsonb("details").$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const exportRecords = pgTable("export_records", {
  id: idColumn(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  scope: exportScopeEnum("scope").notNull(),
  format: exportFormatEnum("format").notNull(),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
});
