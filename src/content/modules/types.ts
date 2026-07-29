export interface AssessmentQuestion {
  id: string;
  prompt: string;
}

export interface ImplementationStepDefinition {
  id: string;
  title: string;
  purpose: string;
  instructions: string;
  defaultEstimatedEffortMinutes: number;
}

export interface ModuleInsight {
  id: string;
  category: "book-concept" | "leadership" | "example" | "caution" | "counterpoint";
  title: string;
  summary: string;
  application?: string;
}

export interface LeadMeasureDefinition {
  label: string;
  unit?: string;
  description: string;
  defaultTarget?: number;
}

export interface ModuleDefinition {
  slug: string;
  week: number;
  title: string;
  subtitle: string;
  contentVersion: string;
  coreEmphasis: string[];
  whyItMatters: string;
  whereItGoesWrong: string;
  leadershipApplication: string;
  personalApplication: string;
  assessmentQuestions: AssessmentQuestion[];
  implementationSteps: ImplementationStepDefinition[];
  leadMeasure: LeadMeasureDefinition;
  sourceNotes: string;
  insights: ModuleInsight[];
}

/** Shared across every module's Reflect section (section 10 of the product spec). */
export const REFLECTION_PROMPTS = [
  { id: "learned", prompt: "What did I learn?" },
  { id: "resisted", prompt: "Where did I resist?" },
  { id: "excuse", prompt: "What excuse appeared?" },
  { id: "evidence", prompt: "What evidence did I create?" },
  { id: "result", prompt: "What produced the greatest result?" },
  { id: "stop", prompt: "What must I stop doing?" },
  { id: "carry-forward", prompt: "What will I carry into next week?" },
] as const;

/** Shared across every module's Complete section. */
export const COMPLETION_AFFIRMATIONS = [
  { id: "reviewed", label: "I reviewed the material." },
  { id: "assessed", label: "I completed my self-assessment." },
  { id: "actions", label: "I selected measurable actions." },
  { id: "evidence", label: "I recorded evidence." },
  { id: "review", label: "I completed the weekly review." },
] as const;

export const ASSESSMENT_SCALE = [
  { value: 1, label: "Almost never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Usually" },
  { value: 5, label: "Consistently" },
] as const;
