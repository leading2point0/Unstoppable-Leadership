import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  actionEvidence,
  assessmentResponses,
  assessments,
  habitEntries,
  habits,
  implementationActions,
  journalEntries,
  leadMeasureEntries,
  leadMeasures,
  moduleProgress,
  operatingSystems,
  programs,
  scorecards,
  userPreferences,
  users,
  weeklyReviews,
} from "@/db/schema";

/**
 * Exports everything owned by a single user — and nothing else. Never
 * includes password hashes, session tokens, or reset tokens.
 */
export async function exportUserData(userId: string) {
  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const userPrograms = await db.select().from(programs).where(eq(programs.ownerId, userId));
  const programIds = userPrograms.map((p) => p.id);

  if (programIds.length === 0) {
    return { exportedAt: new Date().toISOString(), user, programs: [], preferences: null };
  }

  const [
    progressRows,
    assessmentRows,
    actionRows,
    evidenceRows,
    leadMeasureRows,
    habitRows,
    journalRows,
    weeklyReviewRows,
    scorecardRows,
    operatingSystemRows,
    preferences,
  ] = await Promise.all([
    db.select().from(moduleProgress).where(inArray(moduleProgress.programId, programIds)),
    db.select().from(assessments).where(inArray(assessments.programId, programIds)),
    db.select().from(implementationActions).where(inArray(implementationActions.programId, programIds)),
    db.select().from(actionEvidence).where(inArray(actionEvidence.programId, programIds)),
    db.select().from(leadMeasures).where(inArray(leadMeasures.programId, programIds)),
    db.select().from(habits).where(inArray(habits.programId, programIds)),
    db.select().from(journalEntries).where(inArray(journalEntries.programId, programIds)),
    db.select().from(weeklyReviews).where(inArray(weeklyReviews.programId, programIds)),
    db.select().from(scorecards).where(inArray(scorecards.programId, programIds)),
    db.select().from(operatingSystems).where(inArray(operatingSystems.programId, programIds)),
    db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1),
  ]);

  const assessmentIds = assessmentRows.map((a) => a.id);
  const assessmentResponseRows = assessmentIds.length
    ? await db.select().from(assessmentResponses).where(inArray(assessmentResponses.assessmentId, assessmentIds))
    : [];

  const leadMeasureIds = leadMeasureRows.map((lm) => lm.id);
  const leadMeasureEntryRows = leadMeasureIds.length
    ? await db.select().from(leadMeasureEntries).where(inArray(leadMeasureEntries.leadMeasureId, leadMeasureIds))
    : [];

  const habitIds = habitRows.map((h) => h.id);
  const habitEntryRows = habitIds.length
    ? await db.select().from(habitEntries).where(inArray(habitEntries.habitId, habitIds))
    : [];

  return {
    exportedAt: new Date().toISOString(),
    user,
    preferences: preferences[0] ?? null,
    programs: userPrograms.map((program) => ({
      ...program,
      moduleProgress: progressRows.filter((r) => r.programId === program.id),
      assessments: assessmentRows
        .filter((a) => a.programId === program.id)
        .map((a) => ({ ...a, responses: assessmentResponseRows.filter((r) => r.assessmentId === a.id) })),
      actions: actionRows
        .filter((a) => a.programId === program.id)
        .map((a) => ({ ...a, evidence: evidenceRows.filter((e) => e.actionId === a.id) })),
      leadMeasures: leadMeasureRows
        .filter((lm) => lm.programId === program.id)
        .map((lm) => ({ ...lm, entries: leadMeasureEntryRows.filter((e) => e.leadMeasureId === lm.id) })),
      habits: habitRows
        .filter((h) => h.programId === program.id)
        .map((h) => ({ ...h, entries: habitEntryRows.filter((e) => e.habitId === h.id) })),
      journalEntries: journalRows.filter((j) => j.programId === program.id),
      weeklyReviews: weeklyReviewRows.filter((w) => w.programId === program.id),
      scorecards: scorecardRows.filter((s) => s.programId === program.id),
      operatingSystem: operatingSystemRows.find((os) => os.programId === program.id) ?? null,
    })),
  };
}
