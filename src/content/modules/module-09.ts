import type { ModuleDefinition } from "./types";

export const module09: ModuleDefinition = {
  slug: "motivating-others",
  week: 9,
  title: "Motivating Others",
  subtitle: "Clarity and specific recognition motivate more reliably than pressure.",
  contentVersion: "1.0.0",
  coreEmphasis: [
    "People perform better when expectations are clear and specific.",
    "Performance needs to be measurable to be meaningfully discussed.",
    "Leaders should identify the small number of outcomes that matter most for each person.",
    "Accountability must be matched with real authority and support, not demands alone.",
    "Recognition is more effective when it is specific about the behavior and its impact.",
  ],
  whyItMatters:
    "Ambiguous expectations are one of the most common, fixable causes of underperformance. When each person on a team knows their Big Three outcomes and how they're measured, motivation becomes a byproduct of clarity rather than something the leader has to manufacture.",
  whereItGoesWrong:
    "Leaders sometimes hold people accountable for outcomes they were never given the authority or resources to control, which produces resentment rather than performance. Generic praise (\"great job, team\") is also far less motivating than specific recognition of what was actually done well.",
  leadershipApplication:
    "Defining each person's Big Three outcomes in writing, checking what's currently blocking them, and matching authority to accountability are concrete, repeatable leadership behaviors — not personality traits.",
  personalApplication:
    "If you lead even one other person, in a job, a household, or a volunteer role, apply this module directly to that relationship rather than treating it as workplace-only content.",
  assessmentQuestions: [
    { id: "q1", prompt: "The people I'm responsible for know their top priorities in specific, measurable terms." },
    { id: "q2", prompt: "I regularly ask what is currently blocking someone's performance." },
    { id: "q3", prompt: "I match accountability with the authority and support needed to deliver." },
    { id: "q4", prompt: "My recognition of others names the specific behavior and its impact." },
    { id: "q5", prompt: "I have a clear definition of what \"winning\" looks like for each key role I oversee." },
    { id: "q6", prompt: "I check in on progress on a predictable schedule, not only when something goes wrong." },
  ],
  implementationSteps: [
    {
      id: "step-1",
      title: "Define each person's Big Three outcomes",
      purpose: "Replace vague expectations with a short, specific list.",
      instructions: "For one person you lead or support, write the three outcomes that matter most from them this quarter.",
      defaultEstimatedEffortMinutes: 25,
    },
    {
      id: "step-2",
      title: "Establish a definition of winning",
      purpose: "Make success recognizable rather than subjective.",
      instructions: "Write one sentence describing exactly what \"doing this well\" looks like for each Big Three outcome.",
      defaultEstimatedEffortMinutes: 15,
    },
    {
      id: "step-3",
      title: "Ask what is blocking performance",
      purpose: "Surface real obstacles instead of assuming a motivation problem.",
      instructions: "Have a direct conversation asking what is currently in the way, and listen without immediately defending the system.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-4",
      title: "Match accountability with authority and support",
      purpose: "Ensure the person can actually deliver what they're accountable for.",
      instructions: "Identify one gap between what someone is accountable for and what they're actually empowered or resourced to do, and close it.",
      defaultEstimatedEffortMinutes: 20,
    },
    {
      id: "step-5",
      title: "Recognize specific behavior and its impact",
      purpose: "Make recognition reinforcing rather than generic.",
      instructions: "Give recognition this week that names the specific action someone took and the concrete impact it had.",
      defaultEstimatedEffortMinutes: 10,
    },
  ],
  leadMeasure: {
    label: "Percentage of team members with clearly defined Big Three outcomes",
    unit: "%",
    description: "Track the share of people you lead who have written, specific top-three outcomes.",
    defaultTarget: 100,
  },
  sourceNotes:
    "This module paraphrases management concepts on clear expectations, measurable accountability, and specific recognition, common across leadership and organizational-behavior writing. No direct quotations are used.",
  insights: [
    {
      id: "m9-insight-1",
      category: "leadership",
      title: "Specificity is what makes recognition motivating",
      summary:
        "Recognition tied to a specific behavior and its impact tends to reinforce that behavior more reliably than general praise, because it tells the person exactly what to keep doing.",
      application: "This week, replace one generic \"good job\" with a specific, impact-based observation.",
    },
    {
      id: "m9-insight-2",
      category: "caution",
      title: "Accountability without authority breeds resentment",
      summary:
        "Holding someone accountable for an outcome they cannot actually influence is a common and avoidable source of disengagement.",
    },
  ],
};
