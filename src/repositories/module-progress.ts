import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { assessmentResponses, assessments, moduleProgress } from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import { summarizeAssessment, type AssessmentResponseLike } from "@/services/assessment";

export type ModuleProgressRow = typeof moduleProgress.$inferSelect;

export async function listModuleProgress(programId: string, userId: string): Promise<ModuleProgressRow[]> {
  await assertProgramOwnership(programId, userId);
  return db.select().from(moduleProgress).where(eq(moduleProgress.programId, programId));
}

export async function getOrCreateModuleProgress(
  programId: string,
  userId: string,
  moduleSlug: string,
): Promise<ModuleProgressRow> {
  await assertProgramOwnership(programId, userId);
  const [existing] = await db
    .select()
    .from(moduleProgress)
    .where(and(eq(moduleProgress.programId, programId), eq(moduleProgress.moduleSlug, moduleSlug)))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(moduleProgress)
    .values({ programId, moduleSlug, status: "in-progress", startedAt: new Date() })
    .returning();
  return created;
}

export async function markModuleSectionComplete(
  programId: string,
  userId: string,
  moduleSlug: string,
  section: "learn" | "assess" | "apply" | "schedule" | "track" | "reflect",
): Promise<ModuleProgressRow> {
  await assertProgramOwnership(programId, userId);
  const columnMap = {
    learn: "learnCompletedAt",
    assess: "assessCompletedAt",
    apply: "applyCompletedAt",
    schedule: "scheduleCompletedAt",
    track: "trackCompletedAt",
    reflect: "reflectCompletedAt",
  } as const;

  await getOrCreateModuleProgress(programId, userId, moduleSlug);
  const [updated] = await db
    .update(moduleProgress)
    .set({ [columnMap[section]]: new Date(), status: "in-progress" })
    .where(and(eq(moduleProgress.programId, programId), eq(moduleProgress.moduleSlug, moduleSlug)))
    .returning();
  return updated;
}

export async function completeModule(
  programId: string,
  userId: string,
  moduleSlug: string,
  contentVersion: string,
): Promise<ModuleProgressRow> {
  await assertProgramOwnership(programId, userId);
  const [updated] = await db
    .update(moduleProgress)
    .set({ status: "completed", completedAt: new Date(), contentVersionAtCompletion: contentVersion })
    .where(and(eq(moduleProgress.programId, programId), eq(moduleProgress.moduleSlug, moduleSlug)))
    .returning();
  return updated;
}

export async function saveAssessment(
  programId: string,
  userId: string,
  moduleSlug: string,
  responses: AssessmentResponseLike[],
) {
  await assertProgramOwnership(programId, userId);
  const summary = summarizeAssessment(responses);

  const [assessment] = await db
    .insert(assessments)
    .values({
      programId,
      moduleSlug,
      currentScoreAverage: summary.currentAverage.toString(),
      desiredScoreAverage: summary.desiredAverage.toString(),
      largestGapQuestionId: summary.largestGapQuestionId,
    })
    .returning();

  if (responses.length > 0) {
    await db.insert(assessmentResponses).values(
      responses.map((r) => ({
        assessmentId: assessment.id,
        questionId: r.questionId,
        currentScore: r.currentScore,
        desiredScore: r.desiredScore,
      })),
    );
  }

  return { assessment, summary };
}

export async function getLatestAssessment(programId: string, userId: string, moduleSlug: string) {
  await assertProgramOwnership(programId, userId);
  const [latest] = await db
    .select()
    .from(assessments)
    .where(and(eq(assessments.programId, programId), eq(assessments.moduleSlug, moduleSlug)))
    .orderBy(desc(assessments.takenAt))
    .limit(1);
  if (!latest) return null;

  const responses = await db
    .select()
    .from(assessmentResponses)
    .where(eq(assessmentResponses.assessmentId, latest.id));

  return { assessment: latest, responses };
}
