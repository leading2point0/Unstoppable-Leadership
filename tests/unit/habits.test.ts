import { describe, expect, it } from "vitest";
import {
  calculateCurrentStreak,
  calculateMissedDays,
  calculateRecoveryRate,
  calculateTotalCompletions,
  calculateTwelveWeekTrend,
  calculateWeeklyCompletionPercent,
} from "@/services/habits";

function daysAgo(n: number, from = new Date("2026-07-15T12:00:00Z")): string {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

describe("calculateCurrentStreak", () => {
  const today = new Date("2026-07-15T12:00:00Z");

  it("returns 0 with no entries", () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it("counts consecutive completed days ending today", () => {
    const entries = [
      { entryDate: daysAgo(0, today), completed: true },
      { entryDate: daysAgo(1, today), completed: true },
      { entryDate: daysAgo(2, today), completed: true },
    ];
    expect(calculateCurrentStreak(entries, today)).toBe(3);
  });

  it("stops counting at the first missed day", () => {
    const entries = [
      { entryDate: daysAgo(0, today), completed: true },
      { entryDate: daysAgo(1, today), completed: false },
      { entryDate: daysAgo(2, today), completed: true },
    ];
    expect(calculateCurrentStreak(entries, today)).toBe(1);
  });

  it("does not zero out an intact streak just because today hasn't been logged yet", () => {
    const entries = [
      { entryDate: daysAgo(1, today), completed: true },
      { entryDate: daysAgo(2, today), completed: true },
    ];
    expect(calculateCurrentStreak(entries, today)).toBe(2);
  });
});

describe("calculateTotalCompletions / calculateMissedDays", () => {
  const entries = [
    { entryDate: "2026-07-01", completed: true },
    { entryDate: "2026-07-02", completed: false },
    { entryDate: "2026-07-03", completed: true },
  ];

  it("counts completions", () => {
    expect(calculateTotalCompletions(entries)).toBe(2);
  });

  it("counts misses", () => {
    expect(calculateMissedDays(entries)).toBe(1);
  });
});

describe("calculateRecoveryRate", () => {
  it("returns null when there are no missed days", () => {
    const entries = [
      { entryDate: "2026-07-01", completed: true },
      { entryDate: "2026-07-02", completed: true },
    ];
    expect(calculateRecoveryRate(entries)).toBeNull();
  });

  it("computes the share of missed days followed by a completed day", () => {
    const entries = [
      { entryDate: "2026-07-01", completed: true },
      { entryDate: "2026-07-02", completed: false }, // miss #1, recovered next day
      { entryDate: "2026-07-03", completed: true },
      { entryDate: "2026-07-04", completed: false }, // miss #2, not recovered next day
      { entryDate: "2026-07-05", completed: false },
    ];
    expect(calculateRecoveryRate(entries)).toBe(50);
  });
});

describe("calculateWeeklyCompletionPercent", () => {
  it("returns 0 for an empty set", () => {
    expect(calculateWeeklyCompletionPercent([])).toBe(0);
  });

  it("computes the completion percentage", () => {
    const entries = [
      { entryDate: "2026-07-01", completed: true },
      { entryDate: "2026-07-02", completed: true },
      { entryDate: "2026-07-03", completed: false },
      { entryDate: "2026-07-04", completed: false },
    ];
    expect(calculateWeeklyCompletionPercent(entries)).toBe(50);
  });
});

describe("calculateTwelveWeekTrend", () => {
  it("always returns exactly twelve weeks", () => {
    const trend = calculateTwelveWeekTrend([], new Date("2026-07-15T12:00:00Z"));
    expect(trend).toHaveLength(12);
  });

  it("gives 0% for weeks with no logged entries", () => {
    const trend = calculateTwelveWeekTrend([], new Date("2026-07-15T12:00:00Z"));
    expect(trend.every((w) => w.percent === 0)).toBe(true);
  });
});
