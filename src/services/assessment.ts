export interface AssessmentResponseLike {
  questionId: string;
  currentScore: number; // 1-5
  desiredScore: number; // 1-5
}

export interface AssessmentSummary {
  currentAverage: number;
  desiredAverage: number;
  largestGapQuestionId: string | null;
  largestGap: number;
}

export function summarizeAssessment(responses: AssessmentResponseLike[]): AssessmentSummary {
  if (responses.length === 0) {
    return { currentAverage: 0, desiredAverage: 0, largestGapQuestionId: null, largestGap: 0 };
  }

  const currentAverage = round(responses.reduce((sum, r) => sum + r.currentScore, 0) / responses.length);
  const desiredAverage = round(responses.reduce((sum, r) => sum + r.desiredScore, 0) / responses.length);

  let largestGapQuestionId: string | null = null;
  let largestGap = -Infinity;
  for (const response of responses) {
    const gap = response.desiredScore - response.currentScore;
    if (gap > largestGap) {
      largestGap = gap;
      largestGapQuestionId = response.questionId;
    }
  }

  return { currentAverage, desiredAverage, largestGapQuestionId, largestGap: largestGap === -Infinity ? 0 : largestGap };
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
