export type InsightCategory =
  | "book-concept"
  | "research"
  | "counterpoint"
  | "example"
  | "leadership"
  | "source"
  | "caution"
  | "quote";

export interface InsightContent {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  application?: string;
  quoteText?: string;
  sourceTitle?: string;
  sourceAuthor?: string;
  sourcePage?: string;
  sourceUrl?: string;
  accessedDate?: string;
  verified: boolean;
}

export const INSIGHT_CATEGORY_LABELS: Record<InsightCategory, string> = {
  "book-concept": "Book concept",
  research: "Research support",
  counterpoint: "Contrasting viewpoint",
  example: "Practical example",
  leadership: "Leadership application",
  source: "Source note",
  caution: "Caution",
  quote: "Quote",
};
