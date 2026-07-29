import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { getModuleBySlug } from "@/content/modules";
import {
  getLatestAssessment,
  getOrCreateModuleProgress,
  listModuleProgress,
} from "@/repositories/module-progress";
import { ensureDefaultActionsForModule, listActions } from "@/repositories/actions";
import { listLeadMeasureEntries } from "@/repositories/lead-measures";
import { ModuleWorkspace } from "@/components/modules/module-workspace";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const moduleDefinition = getModuleBySlug(moduleId);
  return { title: moduleDefinition?.title ?? "Module" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ programId: string; moduleId: string }>;
}) {
  const { programId, moduleId } = await params;
  const user = await requireUser();

  const repo = createProgramRepository(user.id);
  const program = await repo.getProgram(programId);
  if (!program) notFound();

  const moduleDefinition = getModuleBySlug(moduleId);
  if (!moduleDefinition) notFound();

  await getOrCreateModuleProgress(programId, user.id, moduleId);
  await ensureDefaultActionsForModule(programId, user.id, moduleId);

  const [allActions, assessmentResult, leadMeasureEntries] = await Promise.all([
    listActions(programId, user.id),
    getLatestAssessment(programId, user.id, moduleId),
    listLeadMeasureEntries(programId, user.id, moduleId),
  ]);

  const moduleActions = allActions
    .filter((a) => a.moduleSlug === moduleId)
    .sort((a, b) => (a.stepIndex ?? 0) - (b.stepIndex ?? 0));

  const progressRows = await listModuleProgress(programId, user.id);
  const progress = progressRows.find((p) => p.moduleSlug === moduleId) ?? null;

  return (
    <div className="container-page py-10">
      <Badge variant="outline">Week {moduleDefinition.week} of 10</Badge>
      <h1 className="mt-2 font-serif text-3xl font-semibold">{moduleDefinition.title}</h1>
      <p className="text-slate mt-1">{moduleDefinition.subtitle}</p>

      <div className="mt-8">
        <ModuleWorkspace
          module={moduleDefinition}
          programId={programId}
          progress={progress}
          actions={moduleActions}
          assessment={assessmentResult}
          leadMeasureEntries={leadMeasureEntries}
        />
      </div>
    </div>
  );
}
