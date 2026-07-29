"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import {
  completeModule,
  markModuleSectionComplete,
  saveAssessment,
} from "@/repositories/module-progress";
import { addActionEvidence, updateAction } from "@/repositories/actions";
import type { ActionEvidenceInput } from "@/schemas/action";
import { logLeadMeasureEntry } from "@/repositories/lead-measures";
import { createJournalEntry } from "@/repositories/journal";
import { getModuleBySlug } from "@/content/modules";
import type { AssessmentResponseLike } from "@/services/assessment";
import type { UpdateActionInput } from "@/schemas/action";
import { format } from "date-fns";

function revalidateModule(programId: string, moduleSlug: string) {
  revalidatePath(`/program/${programId}/module/${moduleSlug}`);
  revalidatePath(`/program/${programId}`);
  revalidatePath("/dashboard");
  revalidatePath("/actions");
  revalidatePath("/scorecard");
}

export async function markLearnCompleteAction(programId: string, moduleSlug: string) {
  const user = await requireUser();
  await markModuleSectionComplete(programId, user.id, moduleSlug, "learn");
  revalidateModule(programId, moduleSlug);
}

export async function submitAssessmentAction(
  programId: string,
  moduleSlug: string,
  responses: AssessmentResponseLike[],
) {
  const user = await requireUser();
  const result = await saveAssessment(programId, user.id, moduleSlug, responses);
  await markModuleSectionComplete(programId, user.id, moduleSlug, "assess");
  revalidateModule(programId, moduleSlug);
  return result.summary;
}

export async function updateModuleActionAction(
  actionId: string,
  programId: string,
  changes: UpdateActionInput,
) {
  const user = await requireUser();
  const updated = await updateAction(actionId, programId, user.id, changes);
  if (updated.moduleSlug) {
    await markModuleSectionComplete(programId, user.id, updated.moduleSlug, "apply");
    revalidateModule(programId, updated.moduleSlug);
  }
  return updated;
}

export async function addModuleActionEvidenceAction(
  input: ActionEvidenceInput,
  moduleSlug: string,
) {
  const user = await requireUser();
  const evidence = await addActionEvidence(user.id, input);
  await markModuleSectionComplete(input.programId, user.id, moduleSlug, "apply");
  revalidateModule(input.programId, moduleSlug);
  return evidence;
}

export async function markScheduleCompleteAction(programId: string, moduleSlug: string) {
  const user = await requireUser();
  await markModuleSectionComplete(programId, user.id, moduleSlug, "schedule");
  revalidateModule(programId, moduleSlug);
}

export async function logModuleLeadMeasureAction(
  programId: string,
  moduleSlug: string,
  actual: number,
  entryDate?: string,
) {
  const user = await requireUser();
  const moduleDefinition = getModuleBySlug(moduleSlug);
  if (!moduleDefinition) throw new Error("Unknown module.");
  await logLeadMeasureEntry(user.id, {
    programId,
    moduleSlug,
    label: moduleDefinition.leadMeasure.label,
    unit: moduleDefinition.leadMeasure.unit,
    target: moduleDefinition.leadMeasure.defaultTarget,
    entryDate: entryDate ?? format(new Date(), "yyyy-MM-dd"),
    actual,
  });
  await markModuleSectionComplete(programId, user.id, moduleSlug, "track");
  revalidateModule(programId, moduleSlug);
}

export async function submitReflectionAction(
  programId: string,
  moduleSlug: string,
  responses: Record<string, string>,
) {
  const user = await requireUser();
  const body = Object.entries(responses)
    .filter(([, value]) => value.trim().length > 0)
    .map(([id, value]) => `${id}: ${value}`)
    .join("\n\n");

  await createJournalEntry(user.id, {
    programId,
    moduleSlug,
    entryDate: format(new Date(), "yyyy-MM-dd"),
    mode: "standard",
    body,
    tags: ["module-reflection"],
    sharingLevel: "private",
  });
  await markModuleSectionComplete(programId, user.id, moduleSlug, "reflect");
  revalidateModule(programId, moduleSlug);
}

export async function completeModuleAction(programId: string, moduleSlug: string) {
  const user = await requireUser();
  const moduleDefinition = getModuleBySlug(moduleSlug);
  await completeModule(programId, user.id, moduleSlug, moduleDefinition?.contentVersion ?? "1.0.0");
  revalidateModule(programId, moduleSlug);
}
