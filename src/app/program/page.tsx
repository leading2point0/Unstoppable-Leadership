import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";

export default async function ProgramIndexPage() {
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const programs = await repo.listPrograms();
  const active = programs.find((p) => p.status === "active") ?? programs[0];

  if (!active) redirect("/program/new");
  redirect(`/program/${active.id}`);
}
