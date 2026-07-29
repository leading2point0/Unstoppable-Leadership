import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { habitEntries, habits } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { CreateHabitInput, LogHabitEntryInput } from "@/schemas/habit";

export type Habit = typeof habits.$inferSelect;
export type HabitEntry = typeof habitEntries.$inferSelect;

export async function listHabits(programId: string, userId: string): Promise<Habit[]> {
  await assertProgramOwnership(programId, userId);
  return db.select().from(habits).where(eq(habits.programId, programId));
}

export async function createHabit(userId: string, input: CreateHabitInput): Promise<Habit> {
  await assertProgramOwnership(input.programId, userId);
  const [habit] = await db.insert(habits).values(input).returning();
  return habit;
}

export async function archiveHabit(
  habitId: string,
  programId: string,
  userId: string,
): Promise<void> {
  await assertProgramOwnership(programId, userId);
  await db
    .update(habits)
    .set({ isActive: false })
    .where(and(eq(habits.id, habitId), eq(habits.programId, programId)));
}

export async function listHabitEntries(
  habitId: string,
  programId: string,
  userId: string,
): Promise<HabitEntry[]> {
  await assertProgramOwnership(programId, userId);
  return db.select().from(habitEntries).where(eq(habitEntries.habitId, habitId));
}

export async function upsertHabitEntry(
  userId: string,
  input: LogHabitEntryInput,
): Promise<HabitEntry> {
  await assertProgramOwnership(input.programId, userId);
  const [entry] = await db
    .insert(habitEntries)
    .values({
      habitId: input.habitId,
      entryDate: input.entryDate,
      completed: input.completed,
      usedMinimumVersion: input.usedMinimumVersion,
      notes: input.notes,
    })
    .onConflictDoUpdate({
      target: [habitEntries.habitId, habitEntries.entryDate],
      set: {
        completed: input.completed,
        usedMinimumVersion: input.usedMinimumVersion,
        notes: input.notes,
      },
    })
    .returning();
  return entry;
}
