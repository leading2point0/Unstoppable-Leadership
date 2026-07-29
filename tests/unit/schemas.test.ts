import { describe, expect, it } from "vitest";
import { quoteRecordSchema, sourceRecordSchema } from "@/schemas/source";
import { createProgramSchema } from "@/schemas/program";

describe("sourceRecordSchema", () => {
  it("accepts a valid minimal source record", () => {
    const result = sourceRecordSchema.safeParse({
      title: "Unstoppable",
      authorOrOrganization: "Brian Tracy",
      sourceType: "book",
      pagesUsed: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a record missing a required field", () => {
    const result = sourceRecordSchema.safeParse({
      authorOrOrganization: "Brian Tracy",
      sourceType: "book",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid source type", () => {
    const result = sourceRecordSchema.safeParse({
      title: "Something",
      authorOrOrganization: "Someone",
      sourceType: "podcast",
      pagesUsed: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("quoteRecordSchema", () => {
  const validQuote = {
    text: "A short excerpt.",
    author: "Brian Tracy",
    workTitle: "Unstoppable",
    commentary: "This connects to the Module 3 courage exercise.",
    educationalPurpose: "Illustrates the module's core concept for learners.",
  };

  it("accepts a complete quote submission", () => {
    expect(quoteRecordSchema.safeParse(validQuote).success).toBe(true);
  });

  it("rejects a quote with no commentary", () => {
    const { commentary, ...rest } = validQuote;
    void commentary;
    expect(quoteRecordSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a quote with no stated educational purpose", () => {
    const { educationalPurpose, ...rest } = validQuote;
    void educationalPurpose;
    expect(quoteRecordSchema.safeParse(rest).success).toBe(false);
  });

  it("does not accept a client-supplied verification status (schema has no such field)", () => {
    const parsed = quoteRecordSchema.parse(validQuote);
    expect(parsed).not.toHaveProperty("verifiedByOwner");
  });
});

describe("createProgramSchema (onboarding input validation)", () => {
  it("accepts a valid onboarding submission", () => {
    const result = createProgramSchema.safeParse({
      displayName: "Jordan",
      usageType: "individual",
      startDate: "2026-08-01",
      preferredReviewDay: 5,
      challengeLevel: "serious",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing start date", () => {
    const result = createProgramSchema.safeParse({
      displayName: "Jordan",
      usageType: "individual",
      preferredReviewDay: 5,
      challengeLevel: "serious",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a review day outside 0-6", () => {
    const result = createProgramSchema.safeParse({
      displayName: "Jordan",
      usageType: "individual",
      startDate: "2026-08-01",
      preferredReviewDay: 9,
      challengeLevel: "serious",
    });
    expect(result.success).toBe(false);
  });
});
