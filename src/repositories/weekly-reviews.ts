import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  actionEvidence,
  assessments,
  implementationActions,
  leadMeasureEntries,
  leadMeasures,
  moduleProgress,
  scorecards,
  weeklyReviews,
} from "@/db/schema";
import { assertProgramOwnership } from "./authorization";
import type { WeeklyReviewInput } from "@/schemas/weekly-review";
import { calculateWeeklyScore } from "@/services/scorecard";

export type WeeklyReview = typeof weeklyReviews.$inferSelect;
export type Scorecard = typeof scorecards.$inferSelect;

export async function listWeeklyReviews(
  programId: string,
  userId: string,
): Promise<WeeklyReview[]> {
  await assertProgramOwnership(programId, userId);
  return db.select().from(weeklyReviews).where(eq(weeklyReviews.programId, programId));
}

export async function saveWeeklyReview(
  userId: string,
  input: WeeklyReviewInput,
): Promise<WeeklyReview> {
  await assertProgramOwnership(input.programId, userId);
  const [review] = await db
    .insert(weeklyReviews)
    .values({ ...input, completedAt: new Date() })
    .onConflictDoUpdate({
      target: [weeklyReviews.programId, weeklyReviews.weekNumber],
      set: { ...input, completedAt: new Date() },
    })
    .returning();

  await recomputeScorecard(input.programId, userId, input.weekNumber, input.moduleSlug);
  return review;
}

export async function listScorecards(programId: string, userId: string): Promise<Scorecard[]> {
  await assertProgramOwnership(programId, userId);
  return db.select().from(scorecards).where(eq(scorecards.programId, programId));
}

/**
 * Rebuilds a week's ten-point scorecard from the underlying records. Called
 * whenever a module's Assess/Apply/Schedule/Track/Reflect section changes,
 * so the scorecard always reflects current state rather than being a
 * separately-maintained counter that can drift.
 */
export async function recomputeScorecard(
  programId: string,
  userId: string,
  weekNumber: number,
  moduleSlug: string,
): Promise<Scorecard> {
  await assertProgramOwnership(programId, userId);

  const [progress] = await db
    .select()
    .from(moduleProgress)
    .where(and(eq(moduleProgress.programId, programId), eq(moduleProgress.moduleSlug, moduleSlug)))
    .limit(1);

  const [assessment] = await db
    .select({ id: assessments.id })
    .from(assessments)
    .where(and(eq(assessments.programId, programId), eq(assessments.moduleSlug, moduleSlug)))
    .limit(1);

  const actions = await db
    .select()
    .from(implementationActions)
    .where(
      and(
        eq(implementationActions.programId, programId),
        eq(implementationActions.moduleSlug, moduleSlug),
      ),
    );

  const [leadMeasure] = await db
    .select({ id: leadMeasures.id })
    .from(leadMeasures)
    .where(and(eq(leadMeasures.programId, programId), eq(leadMeasures.moduleSlug, moduleSlug)))
    .limit(1);

  let leadMeasureRecorded = false;
  if (leadMeasure) {
    const entries = await db
      .select({ id: leadMeasureEntries.id })
      .from(leadMeasureEntries)
      .where(eq(leadMeasureEntries.leadMeasureId, leadMeasure.id))
      .limit(1);
    leadMeasureRecorded = entries.length > 0;
  }

  const evidenceRows = await db
    .select({ id: actionEvidence.id })
    .from(actionEvidence)
    .where(eq(actionEvidence.programId, programId))
    .limit(1);

  const [review] = await db
    .select()
    .from(weeklyReviews)
    .where(and(eq(weeklyReviews.programId, programId), eq(weeklyReviews.weekNumber, weekNumber)))
    .limit(1);

  const breakdown = calculateWeeklyScore({
    conceptReviewCompleted: Boolean(progress?.learnCompletedAt),
    selfAssessmentCompleted: Boolean(assessment),
    fiveActionsPlanned: actions.length >= 5,
    actionsScheduled: actions.some((a) => Boolean(a.dueDate)),
    difficultActionCompleted: actions.some((a) => a.isDifficultAction && a.status === "completed"),
    leadMeasureRecorded,
    evidenceEntered: evidenceRows.length > 0,
    weeklyReviewCompleted: Boolean(review?.completedAt),
    nextWeekCommitmentCreated: Boolean(review?.nextWeekPriority),
  });

  const [scorecard] = await db
    .insert(scorecards)
    .values({
      programId,
      weekNumber,
      conceptReviewPoint: breakdown.conceptReviewPoint,
      selfAssessmentPoint: breakdown.selfAssessmentPoint,
      actionsPlannedPoint: breakdown.actionsPlannedPoint,
      actionsScheduledPoint: breakdown.actionsScheduledPoint,
      difficultActionPoints: breakdown.difficultActionPoints,
      leadMeasurePoint: breakdown.leadMeasurePoint,
      evidencePoint: breakdown.evidencePoint,
      weeklyReviewPoint: breakdown.weeklyReviewPoint,
      nextWeekCommitmentPoint: breakdown.nextWeekCommitmentPoint,
      totalScore: breakdown.totalScore,
    })
    .onConflictDoUpdate({
      target: [scorecards.programId, scorecards.weekNumber],
      set: {
        conceptReviewPoint: breakdown.conceptReviewPoint,
        selfAssessmentPoint: breakdown.selfAssessmentPoint,
        actionsPlannedPoint: breakdown.actionsPlannedPoint,
        actionsScheduledPoint: breakdown.actionsScheduledPoint,
        difficultActionPoints: breakdown.difficultActionPoints,
        leadMeasurePoint: breakdown.leadMeasurePoint,
        evidencePoint: breakdown.evidencePoint,
        weeklyReviewPoint: breakdown.weeklyReviewPoint,
        nextWeekCommitmentPoint: breakdown.nextWeekCommitmentPoint,
        totalScore: breakdown.totalScore,
      },
    })
    .returning();

  return scorecard;
}
