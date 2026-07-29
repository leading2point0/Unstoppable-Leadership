import { pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { users } from "./auth";
import { userRoleEnum } from "./enums";

export const organizations = pgTable("organizations", {
  id: idColumn(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  ...timestamps,
});

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull().default("participant"),
    ...timestamps,
  },
  (table) => [uniqueIndex("org_members_unique_idx").on(table.organizationId, table.userId)],
);

export const cohorts = pgTable("cohorts", {
  id: idColumn(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  facilitatorId: uuid("facilitator_id").references(() => users.id, { onDelete: "set null" }),
  description: text("description"),
  ...timestamps,
});

export const cohortMembers = pgTable(
  "cohort_members",
  {
    id: idColumn(),
    cohortId: uuid("cohort_id")
      .notNull()
      .references(() => cohorts.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [uniqueIndex("cohort_members_unique_idx").on(table.cohortId, table.userId)],
);
