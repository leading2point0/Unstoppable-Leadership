import type { ModuleDefinition } from "./types";

export const module04: ModuleDefinition = {
  slug: "goal-setting-to-goal-getting",
  week: 4,
  title: "From Goal Setting to Goal Getting",
  subtitle: "A goal without a schedule is a wish.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Goals must be written and stated in measurable terms.",
    "Deadlines create urgency; without one a goal has no gravitational pull.",
    "Large goals require milestones broken down to a workable size.",
    "Daily movement, however small, builds the momentum that sustains a goal.",
    "Lead measures (things you do) are more actionable than lag measures (things you get).",
  ],
  whyItMatters:
    "A goal that only exists as a feeling or a wish rarely survives contact with a busy week. Converting it into a measurable target with a deadline and a lead measure is what makes daily prioritization possible.",
  whereItGoesWrong:
    'People frequently set a lag measure ("lose 20 pounds," "grow revenue 30%") without ever identifying the lead measure — the specific, controllable daily or weekly action that actually produces the result.',
  leadershipApplication:
    "Teams execute better when leaders translate strategic goals into a small number of lead measures everyone can act on this week, rather than only tracking the lagging scoreboard.",
  personalApplication:
    "Choose one goal that matters enough to protect your calendar for it, and identify the single lead measure most responsible for producing it.",
  assessmentQuestions: [
    { id: "q1", prompt: "My primary goal is written down in specific, measurable terms." },
    { id: "q2", prompt: "My goal has a real deadline, not just a general timeframe." },
    { id: "q3", prompt: "I have broken my goal into quarterly, monthly, and weekly milestones." },
    { id: "q4", prompt: "I know which lead measure is most responsible for producing this goal." },
    { id: "q5", prompt: "I take at least one scheduled action toward this goal most days." },
    { id: "q6", prompt: "I review my progress against milestones on a regular schedule." },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Select one primary twelve-month goal",
      purpose: "Concentrate effort on the goal with the highest leverage.",
      instructions: "Write your goal in one measurable sentence with a specific number and date.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-2",
      title: "Establish the current baseline",
      purpose: "Know exactly where you are starting from.",
      instructions: "Write today's honest starting number or status for the goal, with the date.",
      defaultEstimatedEffortMinutes: 10,
    },
    {
      id: "step-3",
      title: "Reverse-engineer milestones",
      purpose: "Make a twelve-month goal workable at a weekly scale.",
      instructions:
        "Work backward from the deadline to quarterly, then monthly, then weekly targets. Write down the very next weekly target.",
      defaultEstimatedEffortMinutes: 30,
    },
    {
      id: "step-4",
      title: "Choose the lead measure",
      purpose: "Identify the controllable action that actually drives the result.",
      instructions:
        "Name the single weekly or daily action most responsible for this goal's progress, and a target amount for it.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-5",
      title: "Schedule the first recurring action",
      purpose: "Move the lead measure from intention to calendar.",
      instructions:
        "Put a specific recurring time on your calendar this week for the lead-measure action.",
      defaultEstimatedEffortMinutes: 10,
    },
  ],
  leadMeasure: {
    label: "Percentage of scheduled goal actions completed",
    unit: "%",
    description: "Track the share of calendar-scheduled goal actions actually completed each week.",
    defaultTarget: 80,
  },
  sourceNotes:
    "This module paraphrases widely used goal-setting frameworks (lead vs. lag measures, milestone decomposition) common across management and personal-development writing. No direct quotations are used.",
  insights: [
    {
      id: "m4-insight-1",
      category: "book-concept",
      title: "Lead measures are what you actually control this week",
      summary:
        "A lag measure tells you the result; a lead measure tells you the behavior that produces it. Managing the lead measure is how the lag measure actually moves.",
      application: "Write your lead measure somewhere you'll see it every workday this week.",
    },
    {
      id: "m4-insight-2",
      category: "example",
      title: "Milestones make a distant deadline usable today",
      summary:
        "A twelve-month revenue goal is too large to act on directly; a weekly call-volume target derived from it is something you can schedule on Monday morning.",
    },
  ],
};
