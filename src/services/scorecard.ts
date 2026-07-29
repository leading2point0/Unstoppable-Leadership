export interface WeeklyScoreInputs {
  conceptReviewCompleted: boolean;
  selfAssessmentCompleted: boolean;
  fiveActionsPlanned: boolean;
  actionsScheduled: boolean;
  difficultActionCompleted: boolean;
  leadMeasureRecorded: boolean;
  evidenceEntered: boolean;
  weeklyReviewCompleted: boolean;
  nextWeekCommitmentCreated: boolean;
}

export interface WeeklyScoreBreakdown {
  conceptReviewPoint: number;
  selfAssessmentPoint: number;
  actionsPlannedPoint: number;
  actionsScheduledPoint: number;
  difficultActionPoints: number;
  leadMeasurePoint: number;
  evidencePoint: number;
  weeklyReviewPoint: number;
  nextWeekCommitmentPoint: number;
  totalScore: number;
}

export const MAX_WEEKLY_SCORE = 10;

/**
 * Ten-point weekly scorecard. This measures program execution — whether the
 * scheduled work of the week happened — not personal worth. Never render it
 * with judgmental language.
 */
export function calculateWeeklyScore(inputs: WeeklyScoreInputs): WeeklyScoreBreakdown {
  const conceptReviewPoint = inputs.conceptReviewCompleted ? 1 : 0;
  const selfAssessmentPoint = inputs.selfAssessmentCompleted ? 1 : 0;
  const actionsPlannedPoint = inputs.fiveActionsPlanned ? 1 : 0;
  const actionsScheduledPoint = inputs.actionsScheduled ? 1 : 0;
  const difficultActionPoints = inputs.difficultActionCompleted ? 2 : 0;
  const leadMeasurePoint = inputs.leadMeasureRecorded ? 1 : 0;
  const evidencePoint = inputs.evidenceEntered ? 1 : 0;
  const weeklyReviewPoint = inputs.weeklyReviewCompleted ? 1 : 0;
  const nextWeekCommitmentPoint = inputs.nextWeekCommitmentCreated ? 1 : 0;

  const totalScore =
    conceptReviewPoint +
    selfAssessmentPoint +
    actionsPlannedPoint +
    actionsScheduledPoint +
    difficultActionPoints +
    leadMeasurePoint +
    evidencePoint +
    weeklyReviewPoint +
    nextWeekCommitmentPoint;

  return {
    conceptReviewPoint,
    selfAssessmentPoint,
    actionsPlannedPoint,
    actionsScheduledPoint,
    difficultActionPoints,
    leadMeasurePoint,
    evidencePoint,
    weeklyReviewPoint,
    nextWeekCommitmentPoint,
    totalScore,
  };
}
