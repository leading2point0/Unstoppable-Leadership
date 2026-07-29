import type { ModuleDefinition } from "./types";

export const module10: ModuleDefinition = {
  slug: "power-of-rituals",
  week: 10,
  title: "The Power of Rituals",
  subtitle: "What repeats without a decision is what actually happens.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Repeated routines reduce the number of decisions you have to make each day.",
    "Planning ahead protects attention from being consumed by whatever appears first.",
    "Environment quietly shapes behavior, often more than willpower does.",
    "Important work should be done before distraction has a chance to compete for attention.",
    "A consistent context (time, place, cue) helps a behavior become close to automatic.",
  ],
  whyItMatters:
    "Nine weeks of principles and actions only compound into lasting change if they're converted into rituals that don't require fresh willpower every day. This closing module is about locking in the routines that will outlast the program itself.",
  whereItGoesWrong:
    "People often try to rely on motivation or willpower to repeat a behavior indefinitely, rather than building an environment and a fixed routine that makes the behavior close to automatic.",
  leadershipApplication:
    "Leaders who install visible team rituals — a weekly priorities review, a consistent start-of-day check-in — create predictable rhythms that reduce chaos and decision fatigue across the group.",
  personalApplication:
    "Choose the one ritual from this module most likely to protect everything else you built in this program, and design it in enough detail that it doesn't depend on motivation.",
  assessmentQuestions: [
    { id: "q1", prompt: "I have a consistent end-of-day shutdown routine." },
    {
      id: "q2",
      prompt: "I protect the first part of my day for high-value work before distractions arrive.",
    },
    {
      id: "q3",
      prompt: "I use habit stacking (attaching a new habit to an existing one) deliberately.",
    },
    {
      id: "q4",
      prompt: "I've shaped my physical or digital environment to make good behavior easier.",
    },
    {
      id: "q5",
      prompt:
        "My important work generally happens before, not after, distraction has taken my attention.",
    },
    {
      id: "q6",
      prompt: "I track my consistency with key rituals over time, not just on individual days.",
    },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Design an end-of-day shutdown ritual",
      purpose: "Create a clear boundary that protects rest and prepares tomorrow.",
      instructions:
        "Write a short, repeatable sequence (3-5 steps) you'll do at the end of each work day.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-2",
      title: "Protect the first hour of the day",
      purpose: "Ensure your highest-value work happens before distraction competes for it.",
      instructions:
        "Decide what belongs in your first working hour and block it on your calendar as a recurring commitment.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-3",
      title: "Create one habit stack",
      purpose: "Use an existing routine as the trigger for a new one.",
      instructions:
        'Write "After I [existing habit], I will [new habit]" and place a visible reminder where the existing habit happens.',
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-4",
      title: "Redesign the environment",
      purpose: "Make the desired behavior the path of least resistance.",
      instructions:
        "Change one physical or digital environment detail to make a good behavior easier or a bad one harder.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-5",
      title: "Track consistency for twelve weeks",
      purpose: "Extend the discipline built in this program beyond its final week.",
      instructions:
        "Set up a simple tracker for your most important ritual and commit to a twelve-week consistency check.",
      defaultEstimatedEffortMinutes: 15,
    },
  ],
  leadMeasure: {
    label: "Percentage of planned rituals completed",
    unit: "%",
    description: "Track the share of your defined daily/weekly rituals actually completed.",
    defaultTarget: 85,
  },
  sourceNotes:
    "This module paraphrases habit-formation and environment-design concepts widely discussed in behavioral-science and personal-development writing. No direct quotations are used.",
  insights: [
    {
      id: "m10-insight-1",
      category: "book-concept",
      title: "Environment often outperforms willpower",
      summary:
        "Shaping the environment to make a behavior easier tends to be more reliable over time than relying on daily motivation or self-discipline alone.",
      application:
        "Change one default in your environment this week to make your best behavior the easiest one.",
    },
    {
      id: "m10-insight-2",
      category: "leadership",
      title: "Rituals compound what a single good day cannot",
      summary:
        "A single motivated day rarely changes a trajectory; a ritual repeated across twelve weeks reliably does.",
    },
  ],
};
