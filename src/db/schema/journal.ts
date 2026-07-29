import { date, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { programs } from "./programs";
import { sharingLevelEnum } from "./enums";

export const journalEntries = pgTable("journal_entries", {
  id: idColumn(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  moduleSlug: text("module_slug"),
  entryDate: date("entry_date").notNull(),
  mode: text("mode").notNull().default("standard"), // standard | ruthless-review
  wins: text("wins"),
  resistance: text("resistance"),
  lessons: text("lessons"),
  decisions: text("decisions"),
  followUpAction: text("follow_up_action"),
  moodRating: integer("mood_rating"),
  energyRating: integer("energy_rating"),
  tags: text("tags").array().notNull().default([]),
  body: text("body"),
  sharingLevel: sharingLevelEnum("sharing_level").notNull().default("private"),
  ...timestamps,
});
