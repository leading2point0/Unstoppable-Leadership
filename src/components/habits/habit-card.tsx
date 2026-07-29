"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Check, X } from "lucide-react";
import type { Habit, HabitEntry } from "@/repositories/habits";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  calculateCurrentStreak,
  calculateMissedDays,
  calculateRecoveryRate,
  calculateTotalCompletions,
  calculateTwelveWeekTrend,
} from "@/services/habits";
import { RECOVERY_MESSAGE } from "@/content/disclaimers";
import { logHabitEntryAction } from "@/lib/actions/habit-actions";

export function HabitCard({ programId, habit, entries }: { programId: string; habit: Habit; entries: HabitEntry[] }) {
  const [pending, startTransition] = useTransition();
  const [showRecovery, setShowRecovery] = useState(false);

  const mapped = entries.map((e) => ({ entryDate: e.entryDate, completed: e.completed }));
  const streak = calculateCurrentStreak(mapped);
  const total = calculateTotalCompletions(mapped);
  const missed = calculateMissedDays(mapped);
  const recovery = calculateRecoveryRate(mapped);
  const trend = calculateTwelveWeekTrend(mapped);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayEntry = entries.find((e) => e.entryDate === today);

  function logToday(completed: boolean) {
    startTransition(async () => {
      await logHabitEntryAction({ habitId: habit.id, programId, entryDate: today, completed, usedMinimumVersion: false });
      if (!completed) setShowRecovery(true);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{habit.name}</CardTitle>
        {habit.reason && <CardDescription>{habit.reason}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={todayEntry?.completed ? "default" : "outline"} onClick={() => logToday(true)} disabled={pending}>
            <Check className="h-4 w-4" aria-hidden="true" /> Done today
          </Button>
          <Button size="sm" variant={todayEntry && !todayEntry.completed ? "destructive" : "outline"} onClick={() => logToday(false)} disabled={pending}>
            <X className="h-4 w-4" aria-hidden="true" /> Missed today
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat label="Streak" value={`${streak}d`} />
          <Stat label="Total" value={String(total)} />
          <Stat label="Missed" value={String(missed)} />
          <Stat label="Recovery" value={recovery === null ? "—" : `${recovery}%`} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">12-week trend</p>
          <div className="mt-2 flex items-end gap-1" role="img" aria-label={`Twelve week completion trend: ${trend.map((w) => `${w.percent}%`).join(", ")}`}>
            {trend.map((week) => (
              <div key={week.weekStart} className="flex-1 rounded-t bg-surface-muted" style={{ height: "40px" }}>
                <div
                  className="w-full rounded-t bg-accent transition-[height]"
                  style={{ height: `${Math.max(4, week.percent * 0.4)}px`, marginTop: `${40 - Math.max(4, week.percent * 0.4)}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        {showRecovery && (
          <div className="rounded-md bg-caution-bg p-3 text-sm text-caution">
            <p className="font-medium">{RECOVERY_MESSAGE}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>What interrupted the routine?</li>
              <li>Was the habit too large?</li>
              <li>Was the trigger unreliable?</li>
              <li>What is the minimum version? {habit.minimumVersion && <span className="font-medium">{habit.minimumVersion}</span>}</li>
              <li>What will change tomorrow?</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-muted">{label}</p>
      <p className="font-serif text-lg font-semibold">{value}</p>
    </div>
  );
}
