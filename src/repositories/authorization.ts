import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { programs } from "@/db/schema";

/**
 * Confirms the given program is owned by the given user. Every repository
 * function that touches program-scoped data must call this before reading
 * or writing, so a participant can never reach another participant's
 * records by guessing an id.
 */
export async function assertProgramOwnership(programId: string, userId: string): Promise<void> {
  const [program] = await db
    .select({ id: programs.id })
    .from(programs)
    .where(and(eq(programs.id, programId), eq(programs.ownerId, userId)))
    .limit(1);
  if (!program) {
    throw new Error("Program not found or not owned by this user.");
  }
}
