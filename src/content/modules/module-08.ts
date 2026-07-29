import type { ModuleDefinition } from "./types";

export const module08: ModuleDefinition = {
  slug: "keys-to-resilience",
  week: 8,
  title: "The Keys to Resilience",
  subtitle: "Prepare for setbacks before they happen.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Problems and setbacks are a normal, inevitable part of any meaningful effort.",
    "Preparation ahead of a setback improves how quickly you recover from it.",
    "Calmness under pressure protects the quality of your judgment.",
    "Verified facts must be separated from the story you're telling about them.",
    "A failure becomes valuable only when a specific lesson changes future behavior.",
  ],
  whyItMatters:
    "Resilience is less about avoiding setbacks and more about how quickly you separate what actually happened from your interpretation of it, and how prepared you are with a next step. Preparation done calmly in advance is far more reliable than composure invented in the moment of crisis.",
  whereItGoesWrong:
    'In the middle of a setback, people often treat their interpretation of events ("this is a disaster," "I always fail at this") as equivalent to the facts, which amplifies the emotional impact and slows recovery.',
  leadershipApplication:
    'Leaders who separate facts from narrative out loud during a crisis — "here is what we know, here is what we don\'t" — help a team stay oriented and reduce panic-driven decisions.',
  personalApplication:
    "Think of a recent setback and separate exactly what happened (facts) from the story you told yourself about what it meant (interpretation).",
  assessmentQuestions: [
    {
      id: "q1",
      prompt:
        "I stay relatively calm when a real problem occurs, rather than escalating internally.",
    },
    {
      id: "q2",
      prompt: "I can separate the verified facts of a setback from my interpretation of it.",
    },
    { id: "q3", prompt: "I have a general plan for how I respond when something goes wrong." },
    {
      id: "q4",
      prompt:
        "I extract a specific, actionable lesson from failures rather than just feeling bad about them.",
    },
    {
      id: "q5",
      prompt: "I think through likely risks in advance rather than only reacting after they occur.",
    },
    {
      id: "q6",
      prompt: "I maintain some kind of reserve (time, money, energy) for when things go wrong.",
    },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Conduct a pre-mortem",
      purpose: "Anticipate likely failure points before they happen.",
      instructions:
        "For your current major goal, imagine it has failed in six months and list the three most likely reasons why.",
      defaultEstimatedEffortMinutes: 25,
    },
    {
      id: "step-2",
      title: "Establish a crisis-response protocol",
      purpose: "Reduce decision load in the moment a real problem occurs.",
      instructions:
        "Write three steps you will take, in order, the moment you recognize a significant setback.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-3",
      title: "Separate verified facts from assumptions",
      purpose: "Prevent interpretation from being treated as fact.",
      instructions:
        "Take a current stressful situation and write two columns: what is verified fact, and what is your interpretation or assumption.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-4",
      title: "Complete a failure review",
      purpose: "Convert a past setback into a usable lesson.",
      instructions:
        "For a recent setback, write what happened, what you learned, and one behavior you'll change because of it.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-5",
      title: "Build practical recovery reserves",
      purpose: "Create a buffer that makes setbacks less costly.",
      instructions:
        "Identify one reserve (time, money, a backup plan, a support contact) you can strengthen this week.",
      defaultEstimatedEffortMinutes: 20,
    },
  ],
  leadMeasure: {
    label: "Number of significant risks with documented contingency plans",
    unit: "risks",
    description: "Count the risks to your current goal that now have a written contingency plan.",
    defaultTarget: 3,
  },
  sourceNotes:
    "This module paraphrases resilience and cognitive-reframing concepts common across psychology and risk-management writing. No direct quotations are used.",
  insights: [
    {
      id: "m8-insight-1",
      category: "book-concept",
      title: "A pre-mortem surfaces risks while they're still cheap to address",
      summary:
        "Imagining failure in advance and working backward tends to surface risks earlier than waiting for them to occur in real time.",
      application: "Run a five-minute pre-mortem before your next significant commitment.",
    },
    {
      id: "m8-insight-2",
      category: "caution",
      title: "This module is not a substitute for professional support",
      summary:
        "If a setback involves a genuine mental-health crisis, safety concern, or medical emergency, use qualified professional or emergency resources rather than relying on self-directed reflection alone.",
    },
  ],
};
