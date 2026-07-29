import { eq } from "drizzle-orm";
import { db } from "@/db";
import { operatingSystems } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { OperatingSystemInput } from "@/schemas/operating-system";

export type OperatingSystem = typeof operatingSystems.$inferSelect;

export async function getOperatingSystem(programId: string, userId: string): Promise<OperatingSystem | null> {
  await assertProgramOwnership(programId, userId);
  const [row] = await db.select().from(operatingSystems).where(eq(operatingSystems.programId, programId)).limit(1);
  return row ?? null;
}

export async function saveOperatingSystem(userId: string, input: OperatingSystemInput): Promise<OperatingSystem> {
  await assertProgramOwnership(input.programId, userId);
  const [row] = await db
    .insert(operatingSystems)
    .values(input)
    .onConflictDoUpdate({ target: operatingSystems.programId, set: input })
    .returning();
  return row;
}

export async function finalizeOperatingSystem(programId: string, userId: string): Promise<OperatingSystem> {
  await assertProgramOwnership(programId, userId);
  const [row] = await db
    .update(operatingSystems)
    .set({ finalizedAt: new Date() })
    .where(eq(operatingSystems.programId, programId))
    .returning();
  return row;
}
