import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["owner", "admin", "facilitator", "participant"]);

export const sharingLevelEnum = pgEnum("sharing_level", [
  "private",
  "completion-only",
  "selected-response",
  "shared-with-facilitator",
]);

export const challengeLevelEnum = pgEnum("challenge_level", ["foundation", "serious", "intensive"]);

export const actionStatusEnum = pgEnum("action_status", [
  "not-started",
  "planned",
  "in-progress",
  "blocked",
  "completed",
  "abandoned-intentionally",
]);

export const recurrenceEnum = pgEnum("recurrence", [
  "none",
  "daily",
  "weekdays",
  "weekly",
  "biweekly",
  "monthly",
]);

export const sourceTypeEnum = pgEnum("source_type", [
  "book",
  "journal",
  "government",
  "official-website",
  "article",
  "video",
  "other",
]);

export const insightCategoryEnum = pgEnum("insight_category", [
  "book-concept",
  "research",
  "counterpoint",
  "example",
  "leadership",
  "source",
  "caution",
  "quote",
]);

export const programStatusEnum = pgEnum("program_status", [
  "active",
  "completed",
  "paused",
  "abandoned",
]);

export const moduleProgressStatusEnum = pgEnum("module_progress_status", [
  "locked",
  "available",
  "in-progress",
  "completed",
]);

export const exportFormatEnum = pgEnum("export_format", ["markdown", "json", "html", "pdf"]);

export const exportScopeEnum = pgEnum("export_scope", [
  "participant-data",
  "owner-full",
  "operating-system",
  "journal",
]);
