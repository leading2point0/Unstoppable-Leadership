"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { finalizeOperatingSystem, saveOperatingSystem } from "@/repositories/operating-system";
import { operatingSystemSchema, type OperatingSystemInput } from "@/schemas/operating-system";

export async function saveOperatingSystemAction(input: OperatingSystemInput) {
  const user = await requireUser();
  const parsed = operatingSystemSchema.parse(input);
  const row = await saveOperatingSystem(user.id, parsed);
  revalidatePath(`/program/${input.programId}/operating-system`);
  return row;
}

export async function finalizeOperatingSystemAction(programId: string) {
  const user = await requireUser();
  const row = await finalizeOperatingSystem(programId, user.id);
  revalidatePath(`/program/${programId}/operating-system`);
  return row;
}
