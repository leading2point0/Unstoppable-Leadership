import type { ModuleDefinition } from "./types";

export const module02: ModuleDefinition = {
  slug: "myths-of-motivation",
  week: 2,
  title: "The Myths of Motivation",
  subtitle: "Action does not need to wait for a feeling.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Action does not need to wait for motivation to arrive first.",
    "Identity strongly influences behavior — we act consistently with who we believe we are.",
    "Excuses weaken personal agency even when they contain a grain of truth.",
    "Responsibility must replace blame before behavior can change.",
    "A desired identity requires repeated behavioral evidence, not just a stated intention.",
  ],
  whyItMatters:
    "Believing that motivation must come first, in full, before you can act is one of the most expensive myths in personal development — it hands control of your behavior to your mood. Separating the decision to act from the feeling of wanting to is what allows consistent execution.",
  whereItGoesWrong:
    'People often accept an explanation for inaction that is technically true but functionally an excuse ("I\'m too busy," "I\'m not a morning person"). The explanation becomes a permanent identity rather than a temporary circumstance to work around.',
  leadershipApplication:
    "When a leader accepts team excuses without examining what is genuinely blocking performance versus what is a story, standards quietly erode. Separating valid constraints from excuses protects both fairness and accountability.",
  personalApplication:
    "Notice the explanation you reach for most often when you don't follow through. Ask honestly whether it describes a fixed constraint or a choice you are protecting.",
  assessmentQuestions: [
    {
      id: "q1",
      prompt: "I take the first useful action before I feel fully prepared or motivated.",
    },
    {
      id: "q2",
      prompt: "I can name the identity I am trying to become, in specific behavioral terms.",
    },
    {
      id: "q3",
      prompt: "I notice when I am using an explanation as an excuse rather than a fact.",
    },
    {
      id: "q4",
      prompt:
        "I take responsibility for outcomes I had some influence over, even when it's uncomfortable.",
    },
    { id: "q5", prompt: "My daily actions provide real evidence for the identity I say I want." },
    { id: "q6", prompt: "I can separate a valid constraint from a story I'm telling myself." },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Identify recurring motivation myths",
      purpose:
        "Surface the specific beliefs about motivation that are quietly limiting your action.",
      instructions:
        'List two or three beliefs you hold about needing to "feel ready" before acting. For each, write one counterexample from your own life where you acted first and the feeling followed.',
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-2",
      title: "Write a behavioral identity statement",
      purpose: "Define who you're becoming in terms that can be observed, not just felt.",
      instructions:
        'Complete the sentence "I am becoming someone who..." with three specific, observable behaviors — not traits or feelings.',
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-3",
      title: "Eliminate one recurring excuse",
      purpose: "Remove the explanation that most often stops you from starting.",
      instructions:
        "Name your most-used excuse. Write the true, complete version of the situation without the softening language, and one action you can take despite it this week.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-4",
      title: "Create daily evidence for the new identity",
      purpose: "Make the identity statement real through repeated small proof.",
      instructions:
        "Each day, complete one small action that only someone with your target identity would do, and note it.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-5",
      title: "Audit the gap between stated values and repeated behavior",
      purpose: "Close the distance between what you say matters and what your calendar shows.",
      instructions:
        "Compare your stated top priority to how you actually spent your time this week. Write one sentence describing the gap, without judgment, and one adjustment for next week.",
      defaultEstimatedEffortMinutes: 20,
    },
  ],
  leadMeasure: {
    label: "Number of actions that provide evidence of the desired identity",
    unit: "actions",
    description:
      "Count daily actions that were only taken because of the identity you're building.",
    defaultTarget: 7,
  },
  sourceNotes:
    "This module paraphrases widely discussed ideas from identity-based behavior-change literature. No direct quotations are used. See the Sources page for verified citations where added.",
  insights: [
    {
      id: "m2-insight-1",
      category: "book-concept",
      title: "Behavior can lead feeling, not just follow it",
      summary:
        'Acting "as if" you already had the trait you want is a recurring strategy across personal-development writing — behavior generates evidence, and evidence changes self-perception over time.',
      application:
        "Choose one behavior today that your target identity would do, regardless of mood.",
    },
    {
      id: "m2-insight-2",
      category: "counterpoint",
      title: "Not every explanation is an excuse",
      summary:
        "Real constraints exist — caregiving responsibilities, health conditions, financial limits. The goal of this module is honest sorting, not dismissing every obstacle as a story.",
    },
  ],
};
