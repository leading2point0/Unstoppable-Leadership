import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { journalEntries } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { CreateJournalEntryInput } from "@/schemas/journal";

export type JournalEntry = typeof journalEntries.$inferSelect;

export async function listJournalEntries(
  programId: string,
  userId: string,
): Promise<JournalEntry[]> {
  await assertProgramOwnership(programId, userId);
  return db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.programId, programId))
    .orderBy(desc(journalEntries.entryDate));
}

export async function createJournalEntry(
  userId: string,
  input: CreateJournalEntryInput,
): Promise<JournalEntry> {
  await assertProgramOwnership(input.programId, userId);
  const [entry] = await db.insert(journalEntries).values(input).returning();
  return entry;
}

export async function deleteJournalEntry(
  entryId: string,
  programId: string,
  userId: string,
): Promise<void> {
  await assertProgramOwnership(programId, userId);
  await db
    .delete(journalEntries)
    .where(and(eq(journalEntries.id, entryId), eq(journalEntries.programId, programId)));
}
