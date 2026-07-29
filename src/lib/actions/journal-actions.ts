"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { createJournalEntry, deleteJournalEntry } from "@/repositories/journal";
import { createJournalEntrySchema, type CreateJournalEntryInput } from "@/schemas/journal";

export async function createJournalEntryAction(input: CreateJournalEntryInput) {
  const user = await requireUser();
  const parsed = createJournalEntrySchema.parse(input);
  const entry = await createJournalEntry(user.id, parsed);
  revalidatePath("/journal");
  revalidatePath("/dashboard");
  return entry;
}

export async function deleteJournalEntryAction(entryId: string, programId: string) {
  const user = await requireUser();
  await deleteJournalEntry(entryId, programId, user.id);
  revalidatePath("/journal");
}
