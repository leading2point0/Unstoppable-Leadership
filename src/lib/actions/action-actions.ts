"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { createAction, deleteAction, updateAction } from "@/repositories/actions";
import { createActionSchema, updateActionSchema, type CreateActionInput, type UpdateActionInput } from "@/schemas/action";

function revalidateActions() {
  revalidatePath("/actions");
  revalidatePath("/dashboard");
}

export async function createStandaloneActionAction(input: CreateActionInput) {
  const user = await requireUser();
  const parsed = createActionSchema.parse(input);
  const action = await createAction(user.id, parsed);
  revalidateActions();
  return action;
}

export async function updateStandaloneActionAction(actionId: string, programId: string, changes: UpdateActionInput) {
  const user = await requireUser();
  const parsed = updateActionSchema.parse(changes);
  const action = await updateAction(actionId, programId, user.id, parsed);
  revalidateActions();
  return action;
}

export async function deleteStandaloneActionAction(actionId: string, programId: string) {
  const user = await requireUser();
  await deleteAction(actionId, programId, user.id);
  revalidateActions();
}
