import type { ModuleDefinition } from "./types";

export const module05: ModuleDefinition = {
  slug: "right-action-and-flexibility",
  week: 5,
  title: "Right Action and Flexibility",
  subtitle: "Stay committed to the result; stay loose about the method.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Action tests assumptions that planning alone cannot verify.",
    "Plans must change when new evidence contradicts them.",
    "Failure can function as operational feedback rather than a verdict.",
    "Commitment to the result does not require loyalty to one specific method.",
    "Unnecessary complexity should be identified and removed.",
  ],
  whyItMatters:
    "Overplanning is a subtle form of avoidance — it feels productive while postponing the moment you find out what actually works. Treating a plan as a hypothesis, not a contract, keeps you adaptable when reality disagrees with the plan.",
  whereItGoesWrong:
    "People often equate changing a plan with failing at it, which makes them defend an approach that isn't working instead of adjusting. Others add process and complexity as a substitute for making a real decision.",
  leadershipApplication:
    'Leaders who model "strong opinions, loosely held" — committing fully to the current plan while staying genuinely open to revising it — build teams that adapt faster and blame less.',
  personalApplication:
    "Identify one area where you've been protecting a specific method rather than the actual outcome you want.",
  assessmentQuestions: [
    { id: "q1", prompt: "I treat my plans as testable, not fixed once written." },
    { id: "q2", prompt: "I change my approach when the evidence says it isn't working." },
    {
      id: "q3",
      prompt:
        "I can separate what I'm committed to (the result) from how I'm currently pursuing it (the method).",
    },
    { id: "q4", prompt: "I review outcomes honestly, including ones that didn't go as planned." },
    { id: "q5", prompt: "I look for ways to simplify a process rather than add to it." },
    {
      id: "q6",
      prompt: "I run small experiments instead of over-planning before I have real information.",
    },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Identify one area of overplanning",
      purpose: "Find where analysis has replaced action.",
      instructions:
        "Name one decision or project where you have been planning longer than the decision warrants.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-2",
      title: "Run a seven-day experiment",
      purpose: "Replace further planning with a real, time-boxed test.",
      instructions:
        "Define a small, reversible version of the action and commit to running it for seven days.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-3",
      title: "Conduct an after-action review",
      purpose: "Extract the lesson before moving on.",
      instructions:
        "Write what you expected, what actually happened, and one adjustment for next time.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-4",
      title: "Develop Plan A, Plan B, and Plan C",
      purpose: "Reduce the emotional cost of changing course.",
      instructions:
        "For your current goal, write one alternate approach (Plan B) and one fallback (Plan C).",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-5",
      title: "Remove one unnecessary process or commitment",
      purpose: "Create capacity by eliminating, not just adding.",
      instructions:
        "Identify one recurring task, meeting, or commitment that no longer earns its place, and end it.",
      defaultEstimatedEffortMinutes: 15,
    },
  ],
  leadMeasure: {
    label: "Number of useful experiments and documented lessons",
    unit: "experiments",
    description:
      "Count small experiments run this week and whether each produced a written lesson.",
    defaultTarget: 2,
  },
  sourceNotes:
    "This module paraphrases iterative/agile planning concepts common across management writing (build-measure-learn cycles, after-action reviews). No direct quotations are used.",
  insights: [
    {
      id: "m5-insight-1",
      category: "book-concept",
      title: "A plan is a hypothesis, not a contract",
      summary:
        "Treating a plan as testable rather than binding makes it easier to change course without treating the change as a personal failure.",
      application:
        "Before your next plan review, ask: what would change my mind about this approach?",
    },
    {
      id: "m5-insight-2",
      category: "leadership",
      title: "After-action reviews work best without blame",
      summary:
        "Teams extract more useful lessons from a setback when the review focuses on what happened and why, rather than who is at fault.",
    },
  ],
};
