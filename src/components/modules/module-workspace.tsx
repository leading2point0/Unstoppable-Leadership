"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ModuleDefinition } from "@/content/modules";
import type { ImplementationAction } from "@/repositories/actions";
import type { LeadMeasureEntry } from "@/repositories/lead-measures";
import { LearnSection } from "./learn-section";
import { AssessSection } from "./assess-section";
import { ApplySection } from "./apply-section";
import { ScheduleSection } from "./schedule-section";
import { TrackSection } from "./track-section";
import { ReflectSection } from "./reflect-section";
import { CompleteSection } from "./complete-section";
import { cn } from "@/lib/utils";

const SECTIONS = ["learn", "assess", "apply", "schedule", "track", "reflect", "complete"] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABELS: Record<Section, string> = {
  learn: "Learn",
  assess: "Assess",
  apply: "Apply",
  schedule: "Schedule",
  track: "Track",
  reflect: "Reflect",
  complete: "Complete",
};

export interface ModuleWorkspaceProps {
  module: ModuleDefinition;
  programId: string;
  progress: {
    learnCompletedAt: Date | null;
    assessCompletedAt: Date | null;
    applyCompletedAt: Date | null;
    scheduleCompletedAt: Date | null;
    trackCompletedAt: Date | null;
    reflectCompletedAt: Date | null;
    completedAt: Date | null;
  } | null;
  actions: ImplementationAction[];
  assessment: { responses: { questionId: string; currentScore: number; desiredScore: number }[] } | null;
  leadMeasureEntries: LeadMeasureEntry[];
}

export function ModuleWorkspace({
  module,
  programId,
  progress,
  actions,
  assessment,
  leadMeasureEntries,
}: ModuleWorkspaceProps) {
  const doneMap: Record<Section, boolean> = {
    learn: Boolean(progress?.learnCompletedAt),
    assess: Boolean(progress?.assessCompletedAt),
    apply: Boolean(progress?.applyCompletedAt),
    schedule: Boolean(progress?.scheduleCompletedAt),
    track: Boolean(progress?.trackCompletedAt),
    reflect: Boolean(progress?.reflectCompletedAt),
    complete: Boolean(progress?.completedAt),
  };

  const [activeSection, setActiveSection] = useState<Section>(() => {
    if (doneMap.complete) return "complete";
    if (!doneMap.learn) return "learn";
    if (!doneMap.assess) return "assess";
    if (!doneMap.apply) return "apply";
    if (!doneMap.schedule) return "schedule";
    if (!doneMap.track) return "track";
    if (!doneMap.reflect) return "reflect";
    return "complete";
  });

  function advanceTo(section: Section) {
    setActiveSection(section);
  }

  return (
    <Tabs value={activeSection} onValueChange={(v) => setActiveSection(v as Section)}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {SECTIONS.map((section) => (
          <TabsTrigger key={section} value={section} className="gap-1.5">
            {SECTION_LABELS[section]}
            {doneMap[section] && <CheckCircle2 className={cn("h-3.5 w-3.5 text-success")} aria-hidden="true" />}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="learn">
        <LearnSection module={module} programId={programId} completed={doneMap.learn} onAdvance={() => advanceTo("assess")} />
      </TabsContent>
      <TabsContent value="assess">
        <AssessSection module={module} programId={programId} existing={assessment} onAdvance={() => advanceTo("apply")} />
      </TabsContent>
      <TabsContent value="apply">
        <ApplySection module={module} programId={programId} actions={actions} onAdvance={() => advanceTo("schedule")} />
      </TabsContent>
      <TabsContent value="schedule">
        <ScheduleSection module={module} programId={programId} actions={actions} onAdvance={() => advanceTo("track")} />
      </TabsContent>
      <TabsContent value="track">
        <TrackSection module={module} programId={programId} entries={leadMeasureEntries} onAdvance={() => advanceTo("reflect")} />
      </TabsContent>
      <TabsContent value="reflect">
        <ReflectSection module={module} programId={programId} alreadyReflected={doneMap.reflect} onAdvance={() => advanceTo("complete")} />
      </TabsContent>
      <TabsContent value="complete">
        <CompleteSection module={module} programId={programId} alreadyCompleted={doneMap.complete} />
      </TabsContent>
    </Tabs>
  );
}
