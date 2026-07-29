import { describe, expect, it } from "vitest";
import {
  calculateProgramCompletionPercent,
  determineCurrentModuleSlug,
  getModuleAvailability,
} from "@/services/progress";
import { PROGRAM_MODULES } from "@/content/modules";

describe("calculateProgramCompletionPercent", () => {
  it("returns 0 when nothing is complete", () => {
    expect(calculateProgramCompletionPercent([])).toBe(0);
  });

  it("returns 100 when all ten modules are complete", () => {
    const rows = PROGRAM_MODULES.map((m) => ({ moduleSlug: m.slug, status: "completed" as const }));
    expect(calculateProgramCompletionPercent(rows)).toBe(100);
  });

  it("rounds partial completion", () => {
    const rows = [{ moduleSlug: PROGRAM_MODULES[0].slug, status: "completed" as const }];
    // 1 of 10 = 10%
    expect(calculateProgramCompletionPercent(rows)).toBe(10);
  });
});

describe("determineCurrentModuleSlug", () => {
  it("returns the first module when nothing is complete", () => {
    expect(determineCurrentModuleSlug([])).toBe(PROGRAM_MODULES[0].slug);
  });

  it("returns the first non-completed module", () => {
    const rows = [{ moduleSlug: PROGRAM_MODULES[0].slug, status: "completed" as const }];
    expect(determineCurrentModuleSlug(rows)).toBe(PROGRAM_MODULES[1].slug);
  });

  it("returns the last module when everything is complete", () => {
    const rows = PROGRAM_MODULES.map((m) => ({ moduleSlug: m.slug, status: "completed" as const }));
    expect(determineCurrentModuleSlug(rows)).toBe(PROGRAM_MODULES[PROGRAM_MODULES.length - 1].slug);
  });
});

describe("getModuleAvailability", () => {
  it("only unlocks module one when nothing is complete", () => {
    const availability = getModuleAvailability([]);
    expect(availability[0].status).toBe("available");
    expect(availability[1].status).toBe("locked");
  });

  it("unlocks the next module once the previous one is completed", () => {
    const rows = [{ moduleSlug: PROGRAM_MODULES[0].slug, status: "completed" as const }];
    const availability = getModuleAvailability(rows);
    expect(availability[0].status).toBe("completed");
    expect(availability[1].status).toBe("available");
    expect(availability[2].status).toBe("locked");
  });

  it("marks an in-progress module distinctly from available", () => {
    const rows = [{ moduleSlug: PROGRAM_MODULES[0].slug, status: "in-progress" as const }];
    const availability = getModuleAvailability(rows);
    expect(availability[0].status).toBe("in-progress");
    expect(availability[1].status).toBe("locked");
  });
});
