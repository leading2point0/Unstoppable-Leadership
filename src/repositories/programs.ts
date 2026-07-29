import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { modules, programs } from "@/db/schema";
import type { CreateProgramInput, UpdateProgramInput } from "@/schemas/program";
import { PROGRAM_MODULES } from "@/content/modules";

export type Program = typeof programs.$inferSelect;

/**
 * Thin, testable abstraction over program persistence — mirrors the
 * ProgramRepository shape described in the product spec, scoped to a single
 * owner so route handlers/server actions can't accidentally cross accounts.
 * A future Supabase-backed implementation can satisfy the same interface.
 */
export interface ProgramRepository {
  createProgram(input: CreateProgramInput): Promise<Program>;
  getProgram(id: string): Promise<Program | null>;
  updateProgram(id: string, changes: UpdateProgramInput): Promise<Program>;
  listPrograms(): Promise<Program[]>;
  deleteProgram(id: string): Promise<void>;
}

export function createProgramRepository(ownerId: string): ProgramRepository {
  return {
    async createProgram(input) {
      const [program] = await db
        .insert(programs)
        .values({
          ownerId,
          displayName: input.displayName,
          primaryReason: input.primaryReason,
          usageType: input.usageType,
          startDate: input.startDate,
          preferredReviewDay: input.preferredReviewDay,
          reminderTime: input.reminderTime,
          primaryLifeArea: input.primaryLifeArea,
          currentGoal: input.currentGoal,
          challengeLevel: input.challengeLevel,
        })
        .returning();

      await ensureModuleRegistrySeeded();
      return program;
    },

    async getProgram(id) {
      const [program] = await db
        .select()
        .from(programs)
        .where(and(eq(programs.id, id), eq(programs.ownerId, ownerId)))
        .limit(1);
      return program ?? null;
    },

    async updateProgram(id, changes) {
      const [program] = await db
        .update(programs)
        .set(changes)
        .where(and(eq(programs.id, id), eq(programs.ownerId, ownerId)))
        .returning();
      if (!program) throw new Error("Program not found or not owned by this user.");
      return program;
    },

    async listPrograms() {
      return db.select().from(programs).where(eq(programs.ownerId, ownerId)).orderBy(desc(programs.createdAt));
    },

    async deleteProgram(id) {
      await db.delete(programs).where(and(eq(programs.id, id), eq(programs.ownerId, ownerId)));
    },
  };
}

let moduleRegistrySeeded = false;

/** Keeps the lightweight `modules` metadata table in sync with the code-defined module content. */
async function ensureModuleRegistrySeeded() {
  if (moduleRegistrySeeded) return;
  for (const module of PROGRAM_MODULES) {
    await db
      .insert(modules)
      .values({
        slug: module.slug,
        weekNumber: module.week,
        title: module.title,
        contentVersion: module.contentVersion,
      })
      .onConflictDoNothing({ target: modules.slug });
  }
  moduleRegistrySeeded = true;
}
