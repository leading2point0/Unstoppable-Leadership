import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { actionEvidence, implementationActions } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { ActionEvidenceInput, CreateActionInput, UpdateActionInput } from "@/schemas/action";
import { nullifyEmptyStrings } from "@/lib/sanitize";
import { getModuleBySlug } from "@/content/modules";

export type ImplementationAction = typeof implementationActions.$inferSelect;

export async function listActions(
  programId: string,
  userId: string,
): Promise<ImplementationAction[]> {
  await assertProgramOwnership(programId, userId);
  return db
    .select()
    .from(implementationActions)
    .where(eq(implementationActions.programId, programId))
    .orderBy(asc(implementationActions.dueDate));
}

export async function createAction(
  userId: string,
  input: CreateActionInput,
): Promise<ImplementationAction> {
  await assertProgramOwnership(input.programId, userId);
  const [action] = await db
    .insert(implementationActions)
    .values(nullifyEmptyStrings(input))
    .returning();
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
    .set({ ...nullifyEmptyStrings(changes), ...(completedAt ? { completedAt } : {}) })
    .where(
      and(eq(implementationActions.id, actionId), eq(implementationActions.programId, programId)),
    )
    .returning();
  if (!action) throw new Error("Action not found.");
  return action;
}

export async function deleteAction(
  actionId: string,
  programId: string,
  userId: string,
): Promise<void> {
  await assertProgramOwnership(programId, userId);
  await db
    .delete(implementationActions)
    .where(
      and(eq(implementationActions.id, actionId), eq(implementationActions.programId, programId)),
    );
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

/**
 * Ensures the five implementation-step actions exist for a module, created
 * once from its content defaults. Deliberately a plain function (no
 * `revalidatePath`) so it's safe to call directly during a Server
 * Component's render — Next.js forbids calling `revalidatePath` mid-render,
 * so this must not be a "use server" action invoked from the page itself.
 */
export async function ensureDefaultActionsForModule(
  programId: string,
  userId: string,
  moduleSlug: string,
): Promise<void> {
  const moduleDefinition = getModuleBySlug(moduleSlug);
  if (!moduleDefinition) return;

  const existing = await listActions(programId, userId);
  const existingByStep = new Set(
    existing.filter((a) => a.moduleSlug === moduleSlug).map((a) => a.stepIndex),
  );

  for (let i = 0; i < moduleDefinition.implementationSteps.length; i++) {
    if (existingByStep.has(i)) continue;
    const step = moduleDefinition.implementationSteps[i];
    await createAction(userId, {
      programId,
      moduleSlug,
      stepIndex: i,
      title: step.title,
      description: step.instructions,
      reason: step.purpose,
      importance: "important",
      estimatedEffortMinutes: step.defaultEstimatedEffortMinutes,
      recurrence: "none",
      isDifficultAction: false,
    });
  }
}
