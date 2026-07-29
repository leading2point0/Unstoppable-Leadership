import { isPast, isToday, parseISO } from "date-fns";
import { createProgramRepository, type Program } from "@/repositories/programs";
import { listModuleProgress } from "@/repositories/module-progress";
import { listActions, listActionEvidence, type ImplementationAction } from "@/repositories/actions";
import { listHabits, listHabitEntries, type Habit } from "@/repositories/habits";
import { listJournalEntries } from "@/repositories/journal";
import { listScorecards } from "@/repositories/weekly-reviews";
import { getOperatingSystem } from "@/repositories/operating-system";
import { calculateProgramCompletionPercent, determineCurrentModuleSlug } from "@/services/progress";
import { calculateCurrentStreak, calculateWeeklyCompletionPercent } from "@/services/habits";
import { getModuleBySlug } from "@/content/modules";

export interface DashboardData {
  program: Program | null;
  currentModuleSlug: string | null;
  currentModuleTitle: string | null;
  currentWeek: number;
  completionPercent: number;
  todaysActions: ImplementationAction[];
  overdueActions: ImplementationAction[];
  recommendedNextAction: ImplementationAction | null;
  habitsWithConsistency: { habit: Habit; consistency: number; streak: number }[];
  reflectionStreak: number;
  weeklyScoreTotal: number | null;
  bigThree: string[];
  primaryGoal: string | null;
  recentEvidence: { id: string; description: string; completionDate: string }[];
  nextReviewDay: number;
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const programRepo = createProgramRepository(userId);
  const programs = await programRepo.listPrograms();
  const program = programs.find((p) => p.status === "active") ?? programs[0] ?? null;

  if (!program) {
    return {
      program: null,
      currentModuleSlug: null,
      currentModuleTitle: null,
      currentWeek: 1,
      completionPercent: 0,
      todaysActions: [],
      overdueActions: [],
      recommendedNextAction: null,
      habitsWithConsistency: [],
      reflectionStreak: 0,
      weeklyScoreTotal: null,
      bigThree: [],
      primaryGoal: null,
      recentEvidence: [],
      nextReviewDay: 5,
    };
  }

  const [
    moduleProgressRows,
    actions,
    habits,
    journalEntries,
    scorecards,
    operatingSystem,
    evidence,
  ] = await Promise.all([
    listModuleProgress(program.id, userId),
    listActions(program.id, userId),
    listHabits(program.id, userId),
    listJournalEntries(program.id, userId),
    listScorecards(program.id, userId),
    getOperatingSystem(program.id, userId),
    listActionEvidence(program.id, userId),
  ]);

  const completionPercent = calculateProgramCompletionPercent(moduleProgressRows);
  const currentModuleSlug = determineCurrentModuleSlug(moduleProgressRows);
  const currentModule = getModuleBySlug(currentModuleSlug);

  const todaysActions = actions.filter(
    (a) =>
      a.status !== "completed" &&
      a.status !== "abandoned-intentionally" &&
      a.dueDate &&
      isToday(parseISO(a.dueDate)),
  );
  const overdueActions = actions.filter(
    (a) =>
      a.status !== "completed" &&
      a.status !== "abandoned-intentionally" &&
      a.dueDate &&
      isPast(parseISO(a.dueDate)) &&
      !isToday(parseISO(a.dueDate)),
  );
  const recommendedNextAction =
    todaysActions[0] ??
    overdueActions[0] ??
    actions.find((a) => a.status === "not-started" || a.status === "planned") ??
    null;

  const habitsWithConsistency = await Promise.all(
    habits
      .filter((h) => h.isActive)
      .map(async (habit) => {
        const entries = await listHabitEntries(habit.id, program.id, userId);
        const mapped = entries.map((e) => ({ entryDate: e.entryDate, completed: e.completed }));
        return {
          habit,
          consistency: calculateWeeklyCompletionPercent(mapped),
          streak: calculateCurrentStreak(mapped),
        };
      }),
  );

  const reflectionStreak = calculateCurrentStreak(
    journalEntries.map((entry) => ({ entryDate: entry.entryDate, completed: true })),
  );

  const currentWeekScorecard =
    scorecards.find((sc) => sc.weekNumber === (currentModule?.week ?? 1)) ?? scorecards.at(-1);
  const weeklyScoreTotal = scorecards.length > 0 ? (currentWeekScorecard?.totalScore ?? 0) : null;

  const recentEvidence = evidence
    .slice()
    .sort((a, b) => b.completionDate.localeCompare(a.completionDate))
    .slice(0, 3)
    .map((e) => ({ id: e.id, description: e.description, completionDate: e.completionDate }));

  return {
    program,
    currentModuleSlug,
    currentModuleTitle: currentModule?.title ?? null,
    currentWeek: currentModule?.week ?? 1,
    completionPercent,
    todaysActions,
    overdueActions,
    recommendedNextAction,
    habitsWithConsistency,
    reflectionStreak,
    weeklyScoreTotal,
    bigThree: (operatingSystem?.bigThree as string[]) ?? [],
    primaryGoal: program.currentGoal,
    recentEvidence,
    nextReviewDay: program.preferredReviewDay,
  };
}
