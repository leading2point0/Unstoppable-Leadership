"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { createHabit, upsertHabitEntry } from "@/repositories/habits";
import {
  createHabitSchema,
  logHabitEntrySchema,
  type CreateHabitInput,
  type LogHabitEntryInput,
} from "@/schemas/habit";

export async function createHabitAction(input: CreateHabitInput) {
  const user = await requireUser();
  const parsed = createHabitSchema.parse(input);
  const habit = await createHabit(user.id, parsed);
  revalidatePath("/habits");
  return habit;
}

export async function logHabitEntryAction(input: LogHabitEntryInput) {
  const user = await requireUser();
  const parsed = logHabitEntrySchema.parse(input);
  const entry = await upsertHabitEntry(user.id, parsed);
  revalidatePath("/habits");
  revalidatePath("/dashboard");
  return entry;
}
