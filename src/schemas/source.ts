import { z } from "zod";

export const sourceTypeValues = [
  "book",
  "journal",
  "government",
  "official-website",
  "article",
  "video",
  "other",
] as const;

export const sourceRecordSchema = z.object({
  title: z.string().min(1, "Title is required.").max(300),
  authorOrOrganization: z.string().min(1, "Author or organization is required.").max(200),
  publication: z.string().max(200).optional(),
  publicationDate: z.string().optional(),
  accessedDate: z.string().optional(),
  sourceType: z.enum(sourceTypeValues),
  url: z.string().url().optional().or(z.literal("")),
  isbn: z.string().max(20).optional(),
  doi: z.string().max(100).optional(),
  edition: z.string().max(100).optional(),
  publisher: z.string().max(200).optional(),
  pagesUsed: z.array(z.string()).default([]),
  notes: z.string().max(1000).optional(),
});
export type SourceRecordInput = z.infer<typeof sourceRecordSchema>;

export const quoteRecordSchema = z.object({
  text: z.string().min(1, "Quote text is required.").max(2000),
  author: z.string().min(1, "Author is required.").max(200),
  workTitle: z.string().min(1, "Work title is required.").max(300),
  publisher: z.string().max(200).optional(),
  edition: z.string().max(100).optional(),
  page: z.string().max(50).optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  sourceId: z.string().uuid().optional(),
  commentary: z
    .string()
    .min(1, "Add original commentary connecting the quote to an exercise or lesson.")
    .max(2000),
  educationalPurpose: z
    .string()
    .min(1, "State the specific educational purpose for including this quote.")
    .max(500),
});
export type QuoteRecordInput = z.infer<typeof quoteRecordSchema>;
