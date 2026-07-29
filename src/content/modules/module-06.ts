import type { ModuleDefinition } from "./types";

export const module06: ModuleDefinition = {
  slug: "daily-self-talk",
  week: 6,
  title: "Daily Self-Talk",
  subtitle: "Internal language should direct action, not just describe mood.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Internal language influences what you pay attention to and how you act.",
    "Negative automatic scripts tend to reinforce avoidance.",
    "Constructive self-talk works best when it directs a specific action.",
    "Visualization can support rehearsal for a specific, upcoming situation.",
    "Any claim about identity needs behavioral proof to be credible to you.",
  ],
  whyItMatters:
    "The sentences you repeat to yourself under pressure shape whether you approach or avoid a difficult moment. Treating self-talk as a tool to direct behavior — rather than just a description of how you feel — makes it useful under stress.",
  whereItGoesWrong:
    "Generic affirmations disconnected from action (\"I am successful\") tend to feel hollow and are easy to dismiss internally. Self-talk becomes credible only when paired with real evidence.",
  leadershipApplication:
    "Leaders set the tone of a team's internal narrative during setbacks — whether the shared language is \"we figure this out\" or \"this always happens to us\" shapes collective effort.",
  personalApplication:
    "Notice the specific sentence you tell yourself right before you avoid a hard task, and design a replacement that points to the next action instead.",
  assessmentQuestions: [
    { id: "q1", prompt: "I notice my automatic self-talk in high-pressure moments." },
    { id: "q2", prompt: "My self-talk usually points toward a specific next action, not just a feeling." },
    { id: "q3", prompt: "I can name a self-talk pattern that reinforces avoidance for me." },
    { id: "q4", prompt: "I use rehearsal or visualization before a difficult, specific situation." },
    { id: "q5", prompt: "I back up positive self-talk with real behavioral evidence, not just repetition." },
    { id: "q6", prompt: "I can catch and interrupt a negative script while it's happening." },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Capture recurring automatic statements",
      purpose: "Make invisible self-talk visible enough to work with.",
      instructions: "Over two days, write down the exact sentence you tell yourself before avoiding a task.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-2",
      title: "Replace fantasy affirmations with action statements",
      purpose: "Make self-talk credible by tying it to something you actually do.",
      instructions:
        "For one recurring negative statement, write a replacement that names the next concrete action instead of a general feeling.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-3",
      title: "Create five performance cues",
      purpose: "Prepare short, action-directing phrases you can use under pressure.",
      instructions: "Write five short phrases you can say to yourself in the specific moments you tend to hesitate.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-4",
      title: "Rehearse one difficult situation",
      purpose: "Reduce surprise and increase readiness through mental rehearsal.",
      instructions: "Spend five minutes mentally walking through an upcoming difficult situation and your planned response.",
      defaultEstimatedEffortMinutes: 10,
    },
    {
      id: "step-5",
      title: "Pair every statement with observable proof",
      purpose: "Keep self-talk honest and credible.",
      instructions: "For each performance cue, note one piece of real evidence from this week that supports it.",
      defaultEstimatedEffortMinutes: 15,
    },
  ],
  leadMeasure: {
    label: "Percentage of performance statements supported by action",
    unit: "%",
    description: "Of the performance cues you used this week, what share were followed by the intended action?",
    defaultTarget: 70,
  },
  sourceNotes:
    "This module paraphrases cognitive-reframing and self-talk concepts widely discussed in sport psychology and personal-development writing. No direct quotations are used.",
  insights: [
    {
      id: "m6-insight-1",
      category: "book-concept",
      title: "Action-directing self-talk outperforms mood-describing self-talk",
      summary:
        "Self-talk that names the next physical action (\"pick up the phone\") tends to be more useful under pressure than self-talk that only asserts a feeling (\"I feel confident\").",
      application: "Rewrite one affirmation you currently use so it names an action instead of a feeling.",
    },
    {
      id: "m6-insight-2",
      category: "caution",
      title: "Repetition without evidence rarely changes belief",
      summary:
        "Repeating a statement you don't believe tends to produce diminishing returns; pairing the statement with real proof is what makes it credible over time.",
    },
  ],
};
