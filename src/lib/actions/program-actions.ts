"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { createProgramSchema, updateProgramSchema, type CreateProgramInput, type UpdateProgramInput } from "@/schemas/program";
import { logAuditEvent } from "@/lib/audit";

export interface ProgramActionResult {
  ok: boolean;
  message?: string;
  programId?: string;
}

export async function createProgramAction(input: CreateProgramInput): Promise<ProgramActionResult> {
  const user = await requireUser();
  const parsed = createProgramSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const repo = createProgramRepository(user.id);
  const program = await repo.createProgram(parsed.data);
  await logAuditEvent({ actorId: user.id, action: "program.created", targetType: "program", targetId: program.id });
  revalidatePath("/dashboard");
  return { ok: true, programId: program.id };
}

export async function updateProgramAction(programId: string, input: UpdateProgramInput): Promise<ProgramActionResult> {
  const user = await requireUser();
  const parsed = updateProgramSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const repo = createProgramRepository(user.id);
  await repo.updateProgram(programId, parsed.data);
  revalidatePath(`/program/${programId}`);
  revalidatePath("/dashboard");
  return { ok: true, programId };
}
