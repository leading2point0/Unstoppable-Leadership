export interface HabitEntryLike {
  entryDate: string; // ISO date, yyyy-MM-dd
  completed: boolean;
}

function toSortedDates(entries: HabitEntryLike[]): string[] {
  return [...entries]
    .filter((e) => e.completed)
    .map((e) => e.entryDate)
    .sort();
}

/** Number of consecutive completed days ending today (or the most recent entry date). */
export function calculateCurrentStreak(entries: HabitEntryLike[], asOf: Date = new Date()): number {
  const completedDates = new Set(toSortedDates(entries));
  if (completedDates.size === 0) return 0;

  let streak = 0;
  const cursor = new Date(asOf);
  cursor.setHours(0, 0, 0, 0);

  // If today isn't complete yet, streak counting starts from yesterday so a
  // not-yet-logged today doesn't zero out an otherwise-intact streak.
  const todayIso = cursor.toISOString().slice(0, 10);
  if (!completedDates.has(todayIso)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (!completedDates.has(iso)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateTotalCompletions(entries: HabitEntryLike[]): number {
  return entries.filter((e) => e.completed).length;
}

export function calculateMissedDays(entries: HabitEntryLike[]): number {
  return entries.filter((e) => !e.completed).length;
}

/**
 * Recovery rate: of the days following a missed day, what share were
 * completed? Measures how reliably a lapse is followed by a bounce-back
 * rather than a longer collapse.
 */
export function calculateRecoveryRate(entries: HabitEntryLike[]): number | null {
  const sorted = [...entries].sort((a, b) => a.entryDate.localeCompare(b.entryDate));
  let missedDays = 0;
  let recoveredDays = 0;

  for (let i = 0; i < sorted.length - 1; i++) {
    if (!sorted[i].completed) {
      missedDays += 1;
      if (sorted[i + 1].completed) recoveredDays += 1;
    }
  }

  if (missedDays === 0) return null;
  return Math.round((recoveredDays / missedDays) * 100);
}

/** Percentage of days completed within a given window (e.g. the 12-week tracker). */
export function calculateWeeklyCompletionPercent(entries: HabitEntryLike[]): number {
  if (entries.length === 0) return 0;
  const completed = entries.filter((e) => e.completed).length;
  return Math.round((completed / entries.length) * 100);
}
