import { describe, expect, it } from "vitest";
import { summarizeAssessment } from "@/services/assessment";

describe("summarizeAssessment", () => {
  it("returns zeros for an empty response set", () => {
    const summary = summarizeAssessment([]);
    expect(summary.currentAverage).toBe(0);
    expect(summary.desiredAverage).toBe(0);
    expect(summary.largestGapQuestionId).toBeNull();
  });

  it("averages current and desired scores", () => {
    const summary = summarizeAssessment([
      { questionId: "q1", currentScore: 2, desiredScore: 4 },
      { questionId: "q2", currentScore: 4, desiredScore: 4 },
    ]);
    expect(summary.currentAverage).toBe(3);
    expect(summary.desiredAverage).toBe(4);
  });

  it("identifies the question with the largest current-to-desired gap", () => {
    const summary = summarizeAssessment([
      { questionId: "q1", currentScore: 4, desiredScore: 5 },
      { questionId: "q2", currentScore: 1, desiredScore: 5 },
      { questionId: "q3", currentScore: 3, desiredScore: 4 },
    ]);
    expect(summary.largestGapQuestionId).toBe("q2");
    expect(summary.largestGap).toBe(4);
  });
});
