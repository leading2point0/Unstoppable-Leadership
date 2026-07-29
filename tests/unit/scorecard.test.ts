import { describe, expect, it } from "vitest";
import { calculateWeeklyScore, MAX_WEEKLY_SCORE } from "@/services/scorecard";

const allTrue = {
  conceptReviewCompleted: true,
  selfAssessmentCompleted: true,
  fiveActionsPlanned: true,
  actionsScheduled: true,
  difficultActionCompleted: true,
  leadMeasureRecorded: true,
  evidenceEntered: true,
  weeklyReviewCompleted: true,
  nextWeekCommitmentCreated: true,
};

const allFalse = {
  conceptReviewCompleted: false,
  selfAssessmentCompleted: false,
  fiveActionsPlanned: false,
  actionsScheduled: false,
  difficultActionCompleted: false,
  leadMeasureRecorded: false,
  evidenceEntered: false,
  weeklyReviewCompleted: false,
  nextWeekCommitmentCreated: false,
};

describe("calculateWeeklyScore", () => {
  it("scores a perfect week at the maximum (10)", () => {
    const result = calculateWeeklyScore(allTrue);
    expect(result.totalScore).toBe(MAX_WEEKLY_SCORE);
    expect(result.totalScore).toBe(10);
  });

  it("scores an empty week at 0", () => {
    const result = calculateWeeklyScore(allFalse);
    expect(result.totalScore).toBe(0);
  });

  it("weights the difficult action at 2 points, not 1", () => {
    const result = calculateWeeklyScore({ ...allFalse, difficultActionCompleted: true });
    expect(result.difficultActionPoints).toBe(2);
    expect(result.totalScore).toBe(2);
  });

  it("weights every other criterion at 1 point", () => {
    const result = calculateWeeklyScore({ ...allFalse, conceptReviewCompleted: true });
    expect(result.conceptReviewPoint).toBe(1);
    expect(result.totalScore).toBe(1);
  });
});
