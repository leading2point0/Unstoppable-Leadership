import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { filterActionsByView, groupActionsByModule } from "@/services/action-views";

describe("filterActionsByView", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  const actions = [
    { id: "1", status: "not-started", dueDate: "2026-07-15", moduleSlug: "m1" },
    { id: "2", status: "planned", dueDate: "2026-07-10", moduleSlug: "m1" },
    { id: "3", status: "blocked", dueDate: "2026-07-16", moduleSlug: "m2" },
    { id: "4", status: "completed", dueDate: "2026-07-01", moduleSlug: "m2" },
    { id: "5", status: "not-started", dueDate: null, moduleSlug: null },
  ];

  it("today view returns only open actions due today", () => {
    const result = filterActionsByView(actions, "today");
    expect(result.map((a) => a.id)).toEqual(["1"]);
  });

  it("overdue view returns open actions due before today", () => {
    const result = filterActionsByView(actions, "overdue");
    expect(result.map((a) => a.id)).toEqual(["2"]);
  });

  it("blocked view returns only blocked actions regardless of date", () => {
    const result = filterActionsByView(actions, "blocked");
    expect(result.map((a) => a.id)).toEqual(["3"]);
  });

  it("completed view returns only completed actions", () => {
    const result = filterActionsByView(actions, "completed");
    expect(result.map((a) => a.id)).toEqual(["4"]);
  });

  it("all view returns everything unfiltered", () => {
    expect(filterActionsByView(actions, "all")).toHaveLength(5);
  });
});

describe("groupActionsByModule", () => {
  it("groups by moduleSlug, with unassigned actions bucketed separately", () => {
    const actions = [
      { id: "1", status: "planned", dueDate: null, moduleSlug: "m1" },
      { id: "2", status: "planned", dueDate: null, moduleSlug: "m1" },
      { id: "3", status: "planned", dueDate: null, moduleSlug: null },
    ];
    const grouped = groupActionsByModule(actions);
    expect(grouped.m1).toHaveLength(2);
    expect(grouped.unassigned).toHaveLength(1);
  });
});
