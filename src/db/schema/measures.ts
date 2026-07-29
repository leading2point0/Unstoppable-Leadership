import { date, numeric, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { programs } from "./programs";

export const leadMeasures = pgTable("lead_measures", {
  id: idColumn(),
  programId: uuid("program_id")
    .notNull()
    .references(() => programs.id, { onDelete: "cascade" }),
  moduleSlug: text("module_slug").notNull(),
  label: text("label").notNull(),
  unit: text("unit"),
  target: numeric("target", { precision: 10, scale: 2 }),
  ...timestamps,
});

export const leadMeasureEntries = pgTable("lead_measure_entries", {
  id: idColumn(),
  leadMeasureId: uuid("lead_measure_id")
    .notNull()
    .references(() => leadMeasures.id, { onDelete: "cascade" }),
  entryDate: date("entry_date").notNull(),
  actual: numeric("actual", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  ...timestamps,
});
