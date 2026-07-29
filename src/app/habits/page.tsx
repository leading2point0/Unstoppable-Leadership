import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { listHabitEntries, listHabits } from "@/repositories/habits";
import { CreateHabitForm } from "@/components/habits/create-habit-form";
import { HabitCard } from "@/components/habits/habit-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Habits" };

export default async function HabitsPage() {
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const programs = await repo.listPrograms();
  const program = programs.find((p) => p.status === "active") ?? programs[0];

  if (!program) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold">No program yet</h1>
        <p className="text-slate mt-2">Start your program to begin tracking habits.</p>
        <Button asChild className="mt-6">
          <Link href="/program/new">Start My Program</Link>
        </Button>
      </div>
    );
  }

  const habits = await listHabits(program.id, user.id);
  const activeHabits = habits.filter((h) => h.isActive);
  const habitsWithEntries = await Promise.all(
    activeHabits.map(async (habit) => ({
      habit,
      entries: await listHabitEntries(habit.id, program.id, user.id),
    })),
  );

  return (
    <div className="container-page py-10">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Habits</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Twelve-week habit tracker</h1>
      <p className="text-slate mt-2 max-w-2xl">
        One missed day is information. Two missed days require a plan — not shame.
      </p>

      <div className="mt-8 space-y-6">
        <CreateHabitForm programId={program.id} />

        {habitsWithEntries.length === 0 ? (
          <p className="text-slate py-8 text-center text-sm">
            No habits yet. Add your first one above.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {habitsWithEntries.map(({ habit, entries }) => (
              <HabitCard key={habit.id} programId={program.id} habit={habit} entries={entries} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
