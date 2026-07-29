import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { listActions } from "@/repositories/actions";
import { ActionsBoard } from "@/components/actions/actions-board";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Actions" };

export default async function ActionsPage() {
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const programs = await repo.listPrograms();
  const program = programs.find((p) => p.status === "active") ?? programs[0];

  if (!program) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold">No program yet</h1>
        <p className="mt-2 text-slate">Start your program to begin managing actions.</p>
        <Button asChild className="mt-6"><Link href="/program/new">Start My Program</Link></Button>
      </div>
    );
  }

  const actions = await listActions(program.id, user.id);

  return (
    <div className="container-page py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Actions</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Every commitment, in one place</h1>
      <p className="mt-2 max-w-2xl text-slate">
        A vague task creates avoidance. Give each action a next physical action specific enough to start without
        thinking.
      </p>
      <div className="mt-8">
        <ActionsBoard programId={program.id} actions={actions} />
      </div>
    </div>
  );
}
