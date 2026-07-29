import { boolean, date, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./helpers";
import { insightCategoryEnum, sourceTypeEnum } from "./enums";
import { users } from "./auth";

export const sourceRecords = pgTable("source_records", {
  id: idColumn(),
  title: text("title").notNull(),
  authorOrOrganization: text("author_or_organization").notNull(),
  publication: text("publication"),
  publicationDate: date("publication_date"),
  accessedDate: date("accessed_date"),
  sourceType: sourceTypeEnum("source_type").notNull(),
  url: text("url"),
  isbn: text("isbn"),
  doi: text("doi"),
  edition: text("edition"),
  publisher: text("publisher"),
  pagesUsed: text("pages_used").array().notNull().default([]),
  notes: text("notes"),
  verified: boolean("verified").notNull().default(false),
  isOutdated: boolean("is_outdated").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(true),
  createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
  ...timestamps,
});

/**
 * Direct quotations. `verifiedByOwner: false` rows MUST NEVER be rendered on
 * any public page — enforce this at the query layer, not just the UI.
 */
export const quoteRecords = pgTable("quote_records", {
  id: idColumn(),
  text: text("text").notNull(),
  author: text("author").notNull(),
  workTitle: text("work_title").notNull(),
  publisher: text("publisher"),
  edition: text("edition"),
  page: text("page"),
  sourceUrl: text("source_url"),
  sourceId: uuid("source_id").references(() => sourceRecords.id, { onDelete: "set null" }),
  verifiedByOwner: boolean("verified_by_owner").notNull().default(false),
  verificationDate: timestamp("verification_date", { withTimezone: true }),
  verifiedById: uuid("verified_by_id").references(() => users.id, { onDelete: "set null" }),
  commentary: text("commentary").notNull(),
  educationalPurpose: text("educational_purpose").notNull(),
  ...timestamps,
});

export const insights = pgTable("insights", {
  id: idColumn(),
  category: insightCategoryEnum("category").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  application: text("application"),
  sourceId: uuid("source_id").references(() => sourceRecords.id, { onDelete: "set null" }),
  quoteId: uuid("quote_id").references(() => quoteRecords.id, { onDelete: "set null" }),
  moduleSlug: text("module_slug"),
  anchorKey: text("anchor_key"),
  verified: boolean("verified").notNull().default(false),
  ...timestamps,
});

export const insightSourceLinks = pgTable("insight_source_links", {
  id: idColumn(),
  insightId: uuid("insight_id")
    .notNull()
    .references(() => insights.id, { onDelete: "cascade" }),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sourceRecords.id, { onDelete: "cascade" }),
  ...timestamps,
});
