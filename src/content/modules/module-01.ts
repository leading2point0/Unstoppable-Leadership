import type { ModuleDefinition } from "./types";

export const module01: ModuleDefinition = {
  slug: "power-of-motivation",
  week: 1,
  title: "The Power of Motivation",
  subtitle: "Motivation is a skill you build, not a mood you wait for.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Motivation can be developed deliberately, the same way a physical skill is trained.",
    "Progress itself is one of the most reliable sources of renewed motivation.",
    "Taking personal responsibility for outcomes increases your sense of control.",
    "Nearly every capability that matters to your goals can be learned.",
    "Continuous, structured learning expands what you are capable of doing.",
  ],
  whyItMatters:
    'Most people treat motivation as something that happens to them — a mood that shows up or doesn\'t. Treating it instead as a trainable capacity changes the question from "how do I feel more motivated" to "what evidence of progress can I generate today." That shift is the foundation for every module that follows.',
  whereItGoesWrong:
    'The most common mistake is waiting for a feeling of readiness before starting. A close second is picking a skill so broad ("get better at leadership") that no concrete curriculum or practice schedule is possible. Vague goals produce vague motivation.',
  leadershipApplication:
    "Leaders who model visible learning — naming what they are studying and what they got wrong — give their teams permission to do the same. A team's appetite for growth rarely exceeds its leader's.",
  personalApplication:
    "Pick one skill that would meaningfully change your work or life if you were noticeably better at it in twelve weeks. Specificity is what makes a learning plan possible.",
  assessmentQuestions: [
    { id: "q1", prompt: "I treat motivation as something I can build, not something I wait for." },
    { id: "q2", prompt: "I can point to a specific skill I am actively developing right now." },
    { id: "q3", prompt: "I keep a record of what I have learned and applied recently." },
    {
      id: "q4",
      prompt:
        "When I feel stuck, I look for the next small action rather than waiting to feel ready.",
    },
    {
      id: "q5",
      prompt:
        "I take responsibility for outcomes rather than attributing them mainly to circumstances.",
    },
    {
      id: "q6",
      prompt:
        "I apply at least one new idea from what I'm learning within a day of encountering it.",
    },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Select one life-changing skill",
      purpose: "Focus your energy on the single skill most likely to change your trajectory.",
      instructions:
        "List three skills that would most change your results if improved. Choose one. Write a single sentence describing why this skill, why now.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-2",
      title: "Complete a capability assessment",
      purpose: "Establish an honest starting point so progress can be measured.",
      instructions:
        "Rate your current capability in the chosen skill from 1-10 and write two or three sentences describing exactly what a 10 would look like in your role.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-3",
      title: "Build a learning curriculum",
      purpose: "Turn a vague intention into a concrete, schedulable plan.",
      instructions:
        "Identify three specific resources (a book, a course, a mentor, practice repetitions) and block time on your calendar for each over the next four weeks.",
      defaultEstimatedEffortMinutes: 30,
    },
    {
      id: "step-4",
      title: "Apply one idea each day",
      purpose: "Convert study into behavior before the material goes stale.",
      instructions:
        "Each day this week, apply one specific idea from your learning to a real task, conversation, or decision — not a hypothetical one.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-5",
      title: "Keep a progress record",
      purpose: "Make progress visible, which is itself a source of motivation.",
      instructions:
        "At the end of each day, write one sentence recording what you practiced and what you noticed. Review the week's entries on your review day.",
      defaultEstimatedEffortMinutes: 10,
    },
  ],
  leadMeasure: {
    label: "Hours spent learning and applying the selected skill",
    unit: "hours",
    description:
      "Log time spent in deliberate study or applied practice of your chosen skill each day.",
    defaultTarget: 5,
  },
  sourceNotes:
    "This module paraphrases a widely discussed premise in personal-development literature — that motivation follows action and evidence of progress rather than preceding it. No direct quotations are used here. See the Sources page for verified citations where research support has been added.",
  insights: [
    {
      id: "m1-insight-1",
      category: "book-concept",
      title: "Progress is a motivational input, not just an output",
      summary:
        "Treating small, visible wins as fuel — rather than waiting for large results — is a recurring theme across personal-development and behavior-change writing.",
      application: "Track one small win today and notice its effect on your energy tomorrow.",
    },
    {
      id: "m1-insight-2",
      category: "caution",
      title: "This is a reflective tool, not a diagnostic instrument",
      summary:
        "The self-assessment in this module produces a personal reflection score, not a validated psychological measurement. Use it to notice patterns, not to make clinical judgments.",
    },
  ],
};
