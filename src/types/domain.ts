export type UserRole = "owner" | "admin" | "facilitator" | "participant";

export type SharingLevel = "private" | "completion-only" | "selected-response" | "shared-with-facilitator";

export type ChallengeLevel = "foundation" | "serious" | "intensive";

export type ActionStatus = "not-started" | "planned" | "in-progress" | "blocked" | "completed" | "abandoned-intentionally";

export type Recurrence = "none" | "daily" | "weekdays" | "weekly" | "biweekly" | "monthly";

export type SourceType = "book" | "journal" | "government" | "official-website" | "article" | "video" | "other";

export type InsightCategory =
  | "book-concept"
  | "research"
  | "counterpoint"
  | "example"
  | "leadership"
  | "source"
  | "caution"
  | "quote";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  participant: 0,
  facilitator: 1,
  admin: 2,
  owner: 3,
};

export function roleAtLeast(role: UserRole, minimum: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimum];
}

export interface QuoteRecord {
  id: string;
  text: string;
  author: string;
  workTitle: string;
  publisher?: string;
  edition?: string;
  page?: string;
  sourceUrl?: string;
  verifiedByOwner: boolean;
  verificationDate?: string;
  commentary: string;
  educationalPurpose: string;
}

export interface SourceRecord {
  id: string;
  title: string;
  authorOrOrganization: string;
  publication?: string;
  publicationDate?: string;
  accessedDate?: string;
  sourceType: SourceType;
  url?: string;
  isbn?: string;
  doi?: string;
  edition?: string;
  publisher?: string;
  pagesUsed?: string[];
  notes?: string;
  verified: boolean;
}

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  application?: string;
  sourceId?: string;
  quoteId?: string;
  verified: boolean;
}
