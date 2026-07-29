export interface OperatingSystemData {
  displayName?: string | null;
  identityStatement?: string | null;
  primaryGoal?: { goal: string; deadline: string; baseline: string; target: string; leadMeasure: string } | null;
  bigThree: string[];
  dailyNonNegotiables: string[];
  weeklyReviewQuestions: string[];
  decisionFilter: string[];
  setbackProtocol: string[];
  leadershipCommitments?: {
    expectations: string;
    accountability: string;
    support: string;
    feedback: string;
    recognition: string;
  } | null;
  habitArchitecture?: {
    morning: string;
    workStart: string;
    shutdown: string;
    health: string;
    relationships: string;
    learning: string;
  } | null;
}

export function operatingSystemToMarkdown(data: OperatingSystemData): string {
  const lines: string[] = [`# My Unstoppable Operating System`, ""];
  if (data.displayName) lines.push(`_Prepared by ${data.displayName}_`, "");

  lines.push("## Identity", data.identityStatement || "_Not yet written_", "");

  if (data.primaryGoal) {
    lines.push(
      "## Primary twelve-month goal",
      `- Goal: ${data.primaryGoal.goal}`,
      `- Deadline: ${data.primaryGoal.deadline}`,
      `- Baseline: ${data.primaryGoal.baseline}`,
      `- Target: ${data.primaryGoal.target}`,
      `- Lead measure: ${data.primaryGoal.leadMeasure}`,
      "",
    );
  }

  lines.push("## Big Three priorities", ...numbered(data.bigThree), "");
  lines.push("## Daily nonnegotiables", ...bulleted(data.dailyNonNegotiables), "");
  lines.push("## Weekly review process", ...numbered(data.weeklyReviewQuestions), "");
  lines.push("## Decision filter", ...numbered(data.decisionFilter), "");
  lines.push("## Setback protocol", ...numbered(data.setbackProtocol), "");

  if (data.leadershipCommitments) {
    const lc = data.leadershipCommitments;
    lines.push(
      "## Leadership commitments",
      `- Expectations: ${lc.expectations}`,
      `- Accountability: ${lc.accountability}`,
      `- Support: ${lc.support}`,
      `- Feedback: ${lc.feedback}`,
      `- Recognition: ${lc.recognition}`,
      "",
    );
  }

  if (data.habitArchitecture) {
    const ha = data.habitArchitecture;
    lines.push(
      "## Habit architecture",
      `- Morning routine: ${ha.morning}`,
      `- Work-start routine: ${ha.workStart}`,
      `- Shutdown routine: ${ha.shutdown}`,
      `- Health routine: ${ha.health}`,
      `- Relationship/family routine: ${ha.relationships}`,
      `- Learning routine: ${ha.learning}`,
      "",
    );
  }

  return lines.join("\n");
}

function numbered(items: string[]): string[] {
  return items.length > 0 ? items.map((item, i) => `${i + 1}. ${item}`) : ["_Not yet written_"];
}
function bulleted(items: string[]): string[] {
  return items.length > 0 ? items.map((item) => `- ${item}`) : ["_Not yet written_"];
}
