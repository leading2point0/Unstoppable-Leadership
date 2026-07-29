import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { listJournalEntries } from "@/repositories/journal";
import { JournalEntryForm } from "@/components/forms/journal-entry-form";
import { JournalList } from "@/components/journal/journal-list";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const metadata: Metadata = { title: "Journal" };

export default async function JournalPage() {
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const programs = await repo.listPrograms();
  const program = programs.find((p) => p.status === "active") ?? programs[0];

  if (!program) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="font-serif text-3xl font-semibold">No program yet</h1>
        <p className="mt-2 text-slate">Start your program to begin journaling.</p>
        <Button asChild className="mt-6"><Link href="/program/new">Start My Program</Link></Button>
      </div>
    );
  }

  const entries = await listJournalEntries(program.id, user.id);

  return (
    <div className="container-page py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Journal</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Reflection journal</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-slate">
        <Lock className="h-4 w-4" aria-hidden="true" /> Entries are private by default and never shown to a
        facilitator or administrator unless you explicitly choose to share them.
      </p>

      <div className="mt-8 space-y-8">
        <JournalEntryForm programId={program.id} />
        <JournalList entries={entries} />
      </div>
    </div>
  );
}
