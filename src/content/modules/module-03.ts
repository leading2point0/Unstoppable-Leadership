import type { ModuleDefinition } from "./types";

export const module03: ModuleDefinition = {
  slug: "turning-on-the-action-mechanism",
  week: 3,
  title: "Turning On the Action Mechanism",
  subtitle: "Confidence is downstream of action, not a precondition for it.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Limiting beliefs should be tested against evidence, not accepted as fact.",
    "Confidence develops through repeated action, especially uncomfortable action.",
    "Fear about a specific action often decreases once the action has begun.",
    "Behavior can lead emotion — starting changes how you feel about starting.",
    "Action produces real information that planning alone cannot.",
  ],
  whyItMatters:
    "Many limiting beliefs are simply untested hypotheses. The fastest way to find out whether a fear is accurate is to take the smallest real action that would produce evidence, rather than continuing to reason about it in the abstract.",
  whereItGoesWrong:
    "People often try to reason their way to confidence before acting, which rarely works — confidence is usually a result of action, not a prerequisite for it. Overthinking a decision instead of gathering one piece of real-world evidence is a common trap.",
  leadershipApplication:
    "Leaders who visibly take calculated, uncomfortable action — a hard conversation, a public decision — demonstrate that courage is a practice, not a personality trait, which raises the team's tolerance for productive discomfort.",
  personalApplication:
    "Identify the action you have been avoiding because of a prediction about how it will go, and treat that prediction as a hypothesis to test rather than a fact.",
  assessmentQuestions: [
    { id: "q1", prompt: "I take the first useful action before I feel fully prepared." },
    {
      id: "q2",
      prompt: "I test my limiting beliefs against real evidence instead of assuming they're true.",
    },
    {
      id: "q3",
      prompt: "I notice that fear about a specific action usually decreases once I begin.",
    },
    {
      id: "q4",
      prompt: "I can name at least one uncomfortable but necessary action I took recently.",
    },
    {
      id: "q5",
      prompt: "I have a plan for how I'll respond if a feared outcome actually happens.",
    },
    {
      id: "q6",
      prompt:
        "I record what actually happened after taking action, rather than only what I predicted.",
    },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Identify the dominant limiting belief",
      purpose: "Name the specific belief that is currently blocking a necessary action.",
      instructions:
        "Write the belief in one sentence (e.g., \"If I ask for this, I'll be seen as difficult\"). Rate how certain you are it's true, from 1-10.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-2",
      title: "Define the opposite observable behavior",
      purpose: "Turn an abstract belief into a concrete, testable action.",
      instructions:
        "Write the specific action that would be impossible if the limiting belief were fully true.",
      defaultEstimatedEffortMinutes: 10,
    },
    {
      id: "step-3",
      title: "Complete one courage action",
      purpose: "Generate direct evidence rather than more analysis.",
      instructions:
        "Take the smallest version of that action this week and note exactly what happened, factually.",
      defaultEstimatedEffortMinutes: 30,
    },
    {
      id: "step-4",
      title: "Create an if-then response plan",
      purpose: "Reduce the cost of the feared outcome by preparing for it in advance.",
      instructions:
        'Write one sentence: "If [feared outcome happens], then I will [specific response]." Keep it visible before you act.',
      defaultEstimatedEffortMinutes: 10,
    },
    {
      id: "step-5",
      title: "Record actual results rather than predicted fears",
      purpose: "Compare prediction to reality to recalibrate the belief.",
      instructions:
        "After the action, write what actually happened next to what you predicted would happen. Note the gap.",
      defaultEstimatedEffortMinutes: 10,
    },
  ],
  leadMeasure: {
    label: "Number of uncomfortable but necessary actions completed",
    unit: "actions",
    description:
      "Count actions you took specifically because they were necessary despite discomfort.",
    defaultTarget: 3,
  },
  sourceNotes:
    "This module paraphrases exposure-based and behavioral-activation concepts common across psychology and personal-development writing. No direct quotations are used.",
  insights: [
    {
      id: "m3-insight-1",
      category: "book-concept",
      title: "Fear is often specific to anticipation, not the event itself",
      summary:
        "A recurring observation in personal-development writing is that anticipatory anxiety about a specific action frequently exceeds the discomfort of the action once it is underway.",
      application:
        "Notice how your fear level changes in the first two minutes after you begin the action.",
    },
    {
      id: "m3-insight-2",
      category: "caution",
      title: "Test proportionate risks, not reckless ones",
      summary:
        "This module is about testing beliefs with small, reversible actions — not encouraging actions with real safety, legal, or financial danger. Choose the smallest test that still produces genuine evidence.",
    },
  ],
};
