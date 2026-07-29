import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { quoteRecords, sourceRecords } from "@/db/schema";
import type { QuoteRecordInput, SourceRecordInput } from "@/schemas/source";

export type SourceRecordRow = typeof sourceRecords.$inferSelect;
export type QuoteRecordRow = typeof quoteRecords.$inferSelect;

/** Public listing: only verified, non-outdated sources marked public. */
export async function listPublicSources(): Promise<SourceRecordRow[]> {
  return db
    .select()
    .from(sourceRecords)
    .where(and(eq(sourceRecords.verified, true), eq(sourceRecords.isPublic, true), eq(sourceRecords.isOutdated, false)))
    .orderBy(desc(sourceRecords.createdAt));
}

/**
 * Public quote listing. `verifiedByOwner: false` rows are never returned
 * here — this is the enforcement point for the "unverified quotes must
 * never be displayed publicly" rule, not just a UI-level filter.
 */
export async function listPublicQuotes(): Promise<QuoteRecordRow[]> {
  return db.select().from(quoteRecords).where(eq(quoteRecords.verifiedByOwner, true)).orderBy(desc(quoteRecords.createdAt));
}

export async function listAllSourcesForAdmin(): Promise<SourceRecordRow[]> {
  return db.select().from(sourceRecords).orderBy(desc(sourceRecords.createdAt));
}

export async function listAllQuotesForAdmin(): Promise<QuoteRecordRow[]> {
  return db.select().from(quoteRecords).orderBy(desc(quoteRecords.createdAt));
}

export async function createSource(userId: string, input: SourceRecordInput): Promise<SourceRecordRow> {
  const [row] = await db
    .insert(sourceRecords)
    .values({ ...input, url: input.url || undefined, createdById: userId })
    .returning();
  return row;
}

export async function updateSource(id: string, input: Partial<SourceRecordInput>): Promise<SourceRecordRow> {
  const [row] = await db
    .update(sourceRecords)
    .set({ ...input, url: input.url || undefined })
    .where(eq(sourceRecords.id, id))
    .returning();
  return row;
}

export async function verifySource(id: string): Promise<SourceRecordRow> {
  const [row] = await db.update(sourceRecords).set({ verified: true }).where(eq(sourceRecords.id, id)).returning();
  return row;
}

export async function markSourceOutdated(id: string, outdated: boolean): Promise<SourceRecordRow> {
  const [row] = await db.update(sourceRecords).set({ isOutdated: outdated }).where(eq(sourceRecords.id, id)).returning();
  return row;
}

export async function setSourcePublic(id: string, isPublic: boolean): Promise<SourceRecordRow> {
  const [row] = await db.update(sourceRecords).set({ isPublic }).where(eq(sourceRecords.id, id)).returning();
  return row;
}

/** New quotes always start unverified — verification is a separate, explicit owner action. */
export async function createQuote(input: QuoteRecordInput): Promise<QuoteRecordRow> {
  const [row] = await db
    .insert(quoteRecords)
    .values({ ...input, sourceUrl: input.sourceUrl || undefined, verifiedByOwner: false })
    .returning();
  return row;
}

export async function verifyQuote(id: string, verifiedById: string): Promise<QuoteRecordRow> {
  const [row] = await db
    .update(quoteRecords)
    .set({ verifiedByOwner: true, verificationDate: new Date(), verifiedById })
    .where(eq(quoteRecords.id, id))
    .returning();
  return row;
}

export async function unverifyQuote(id: string): Promise<QuoteRecordRow> {
  const [row] = await db
    .update(quoteRecords)
    .set({ verifiedByOwner: false, verificationDate: null, verifiedById: null })
    .where(eq(quoteRecords.id, id))
    .returning();
  return row;
}

export async function deleteSource(id: string): Promise<void> {
  await db.delete(sourceRecords).where(eq(sourceRecords.id, id));
}

export async function deleteQuote(id: string): Promise<void> {
  await db.delete(quoteRecords).where(eq(quoteRecords.id, id));
}
