import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { actionEvidence, implementationActions } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { ActionEvidenceInput, CreateActionInput, UpdateActionInput } from "@/schemas/action";

export type ImplementationAction = typeof implementationActions.$inferSelect;

export async function listActions(programId: string, userId: string): Promise<ImplementationAction[]> {
  await assertProgramOwnership(programId, userId);
  return db
    .select()
    .from(implementationActions)
    .where(eq(implementationActions.programId, programId))
    .orderBy(asc(implementationActions.dueDate));
}

export async function createAction(userId: string, input: CreateActionInput): Promise<ImplementationAction> {
  await assertProgramOwnership(input.programId, userId);
  const [action] = await db.insert(implementationActions).values(input).returning();
  return action;
}

export async function updateAction(
  actionId: string,
  programId: string,
  userId: string,
  changes: UpdateActionInput,
): Promise<ImplementationAction> {
  await assertProgramOwnership(programId, userId);
  const completedAt = changes.status === "completed" ? new Date() : undefined;
  const [action] = await db
    .update(implementationActions)
    .set({ ...changes, ...(completedAt ? { completedAt } : {}) })
    .where(and(eq(implementationActions.id, actionId), eq(implementationActions.programId, programId)))
    .returning();
  if (!action) throw new Error("Action not found.");
  return action;
}

export async function deleteAction(actionId: string, programId: string, userId: string): Promise<void> {
  await assertProgramOwnership(programId, userId);
  await db
    .delete(implementationActions)
    .where(and(eq(implementationActions.id, actionId), eq(implementationActions.programId, programId)));
}

export async function addActionEvidence(userId: string, input: ActionEvidenceInput) {
  await assertProgramOwnership(input.programId, userId);
  const [evidence] = await db.insert(actionEvidence).values(input).returning();
  await db
    .update(implementationActions)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(implementationActions.id, input.actionId));
  return evidence;
}

export async function listActionEvidence(programId: string, userId: string) {
  await assertProgramOwnership(programId, userId);
  return db.select().from(actionEvidence).where(eq(actionEvidence.programId, programId));
}
