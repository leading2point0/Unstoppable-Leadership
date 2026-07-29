import { PROGRAM_MODULES } from "@/content/modules";

export interface ModuleProgressLike {
  moduleSlug: string;
  status: "locked" | "available" | "in-progress" | "completed";
}

/** Percentage (0-100) of the ten-week program completed, based on completed modules. */
export function calculateProgramCompletionPercent(moduleProgressRows: ModuleProgressLike[]): number {
  const totalModules = PROGRAM_MODULES.length;
  if (totalModules === 0) return 0;
  const completed = moduleProgressRows.filter((row) => row.status === "completed").length;
  return Math.round((completed / totalModules) * 100);
}

/** The module a participant should currently be working on: first non-completed module, else the last. */
export function determineCurrentModuleSlug(moduleProgressRows: ModuleProgressLike[]): string {
  const completedSlugs = new Set(
    moduleProgressRows.filter((row) => row.status === "completed").map((row) => row.moduleSlug),
  );
  const next = PROGRAM_MODULES.find((module) => !completedSlugs.has(module.slug));
  return (next ?? PROGRAM_MODULES[PROGRAM_MODULES.length - 1]).slug;
}
