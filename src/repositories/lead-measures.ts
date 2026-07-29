import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { leadMeasureEntries, leadMeasures } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { LogLeadMeasureEntryInput } from "@/schemas/lead-measure";

export type LeadMeasure = typeof leadMeasures.$inferSelect;
export type LeadMeasureEntry = typeof leadMeasureEntries.$inferSelect;

export async function getOrCreateLeadMeasure(
  programId: string,
  userId: string,
  moduleSlug: string,
  label: string,
  unit?: string,
  target?: number,
): Promise<LeadMeasure> {
  await assertProgramOwnership(programId, userId);
  const [existing] = await db
    .select()
    .from(leadMeasures)
    .where(and(eq(leadMeasures.programId, programId), eq(leadMeasures.moduleSlug, moduleSlug)))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(leadMeasures)
    .values({ programId, moduleSlug, label, unit, target: target?.toString() })
    .returning();
  return created;
}

export async function logLeadMeasureEntry(
  userId: string,
  input: LogLeadMeasureEntryInput,
): Promise<LeadMeasureEntry> {
  const measure = await getOrCreateLeadMeasure(
    input.programId,
    userId,
    input.moduleSlug,
    input.label,
    input.unit,
    input.target,
  );
  const [entry] = await db
    .insert(leadMeasureEntries)
    .values({
      leadMeasureId: measure.id,
      entryDate: input.entryDate,
      actual: input.actual.toString(),
      notes: input.notes,
    })
    .returning();
  return entry;
}

export async function listLeadMeasureEntries(
  programId: string,
  userId: string,
  moduleSlug: string,
): Promise<LeadMeasureEntry[]> {
  await assertProgramOwnership(programId, userId);
  const [measure] = await db
    .select()
    .from(leadMeasures)
    .where(and(eq(leadMeasures.programId, programId), eq(leadMeasures.moduleSlug, moduleSlug)))
    .limit(1);
  if (!measure) return [];
  return db
    .select()
    .from(leadMeasureEntries)
    .where(eq(leadMeasureEntries.leadMeasureId, measure.id));
}
