import { boolean, date, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { programs } from "./programs";

export const habits = pgTable("habits", {
  id: idColumn(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  reason: text("reason"),
  trigger: text("trigger"),
  behavior: text("behavior"),
  reward: text("reward"),
  frequency: text("frequency").notNull().default("daily"), // daily | weekdays | weekly
  minimumVersion: text("minimum_version"),
  targetVersion: text("target_version"),
  startDate: date("start_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const habitEntries = pgTable(
  "habit_entries",
  {
    id: idColumn(),
    habitId: uuid("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    entryDate: date("entry_date").notNull(),
    completed: boolean("completed").notNull().default(true),
    usedMinimumVersion: boolean("used_minimum_version").notNull().default(false),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => [uniqueIndex("habit_entries_unique_idx").on(table.habitId, table.entryDate)],
);
