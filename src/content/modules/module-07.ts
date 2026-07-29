import type { ModuleDefinition } from "./types";

export const module07: ModuleDefinition = {
  slug: "thinking-in-the-long-term",
  week: 7,
  title: "Thinking in the Long Term",
  subtitle: "Every commitment you accept has an opportunity cost.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "Immediate gratification competes constantly with long-term goals.",
    "Long-term thinking changes what looks reasonable to choose today.",
    "Important, non-urgent work must be actively protected on the calendar.",
    "Repeated small sacrifices compound to shape the future.",
    "Every commitment accepted has an opportunity cost somewhere else.",
  ],
  whyItMatters:
    "Short-term pressures are loud; long-term priorities are usually quiet until they become urgent. Deliberately protecting time for what matters in five years is what prevents a life dictated entirely by this week's inbox.",
  whereItGoesWrong:
    "People frequently say yes to short-term requests without evaluating what they displace, because the cost is invisible in the moment and only shows up later as a missed deadline or a neglected priority.",
  leadershipApplication:
    "Leaders who protect strategic time on their own calendar — and explain why — make it acceptable for their teams to do the same, instead of rewarding only reactive busyness.",
  personalApplication:
    "Identify one high-consequence activity you keep postponing in favor of urgent-but-lower-value tasks, and protect a specific block of time for it.",
  assessmentQuestions: [
    { id: "q1", prompt: "I regularly protect time for work that matters long-term but isn't urgent today." },
    { id: "q2", prompt: "I evaluate new commitments by what they will cost me elsewhere." },
    { id: "q3", prompt: "I can describe what my life looks like in five years if my current habits continue unchanged." },
    { id: "q4", prompt: "I have made a deliberate short-term sacrifice recently for a long-term goal." },
    { id: "q5", prompt: "I use a clear filter to decide what commitments to accept or decline." },
    { id: "q6", prompt: "I distinguish between activities that are merely urgent and those that are truly important." },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Write a five-year vision",
      purpose: "Give long-term thinking a concrete target to weigh decisions against.",
      instructions: "Write three to five sentences describing your work and life five years from now if things go well.",
      defaultEstimatedEffortMinutes: 25,
    },
    {
      id: "step-2",
      title: "Identify the likely result of unchanged behavior",
      purpose: "Make the cost of inertia visible.",
      instructions: "Honestly project where your current habits lead in five years if nothing changes.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-3",
      title: "Classify activities as high, necessary, or low value",
      purpose: "Create a simple filter for where your time actually goes.",
      instructions: "List your recurring weekly activities and mark each high-value, necessary, or low-value.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-4",
      title: "Make one strategic sacrifice",
      purpose: "Convert long-term thinking into a real trade-off this week.",
      instructions: "Choose one low-value activity to reduce or remove, and redirect that time to a high-value one.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-5",
      title: "Create a personal decision filter",
      purpose: "Make future trade-offs faster and more consistent.",
      instructions: "Write one or two questions you'll ask before accepting a new commitment going forward.",
      defaultEstimatedEffortMinutes: 15,
    },
  ],
  leadMeasure: {
    label: "Hours protected for high-consequence activity",
    unit: "hours",
    description: "Track hours actually spent on the high-value activity you protected this week.",
    defaultTarget: 4,
  },
  sourceNotes:
    "This module paraphrases time-horizon and opportunity-cost concepts common across economics-informed personal-development writing. No direct quotations are used.",
  insights: [
    {
      id: "m7-insight-1",
      category: "book-concept",
      title: "Unprotected time defaults to whoever asks loudest",
      summary:
        "Without a deliberate block on the calendar, high-value but non-urgent work tends to be displaced by whatever feels most urgent in the moment.",
      application: "Block your highest-value weekly activity on the calendar before the week fills up around it.",
    },
    {
      id: "m7-insight-2",
      category: "example",
      title: "A five-year vision changes today's math",
      summary:
        "A specific, written long-term picture makes it easier to say no to a short-term option that doesn't serve it — the trade-off becomes concrete instead of abstract.",
    },
  ],
};
