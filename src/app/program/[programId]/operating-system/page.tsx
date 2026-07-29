import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { getOperatingSystem } from "@/repositories/operating-system";
import { OperatingSystemForm } from "@/components/forms/operating-system-form";

export const metadata: Metadata = { title: "My Unstoppable Operating System" };

export default async function OperatingSystemPage({ params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const program = await repo.getProgram(programId);
  if (!program) notFound();

  const existing = await getOperatingSystem(programId, user.id);

  return (
    <div className="container-page container-prose py-10 print:max-w-none">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent print:hidden">Final document</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">My Unstoppable Operating System</h1>
      <p className="mt-2 text-slate print:hidden">
        Edit freely — this document should keep evolving. Export it or print it to keep in a binder.
      </p>

      <div className="mt-8">
        <OperatingSystemForm programId={programId} existing={existing} />
      </div>
    </div>
  );
}
