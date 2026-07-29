"use client";

import { useTransition } from "react";
import type { ModuleDefinition } from "@/content/modules";
import { InsightPopover } from "@/components/insights/insight-popover";
import type { InsightContent } from "@/types/insight";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { markLearnCompleteAction } from "@/lib/actions/module-actions";

export function LearnSection({
  module,
  programId,
  completed,
  onAdvance,
}: {
  module: ModuleDefinition;
  programId: string;
  completed: boolean;
  onAdvance: () => void;
}) {
  const [pending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async () => {
      await markLearnCompleteAction(programId, module.slug);
      onAdvance();
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Key concepts</h2>
        <ul className="mt-4 space-y-3">
          {module.coreEmphasis.map((point, index) => {
            const insight = module.insights[index % Math.max(module.insights.length, 1)];
            return (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>
                  {point}
                  {insight && index < module.insights.length && (
                    <InsightPopover insight={toInsightContent(insight)} />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-lg font-semibold">Why this matters</h3>
          <p className="mt-2 text-slate">{module.whyItMatters}</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">Where people get this wrong</h3>
          <p className="mt-2 text-slate">{module.whereItGoesWrong}</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">Leadership application</h3>
          <p className="mt-2 text-slate">{module.leadershipApplication}</p>
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">Personal application</h3>
          <p className="mt-2 text-slate">{module.personalApplication}</p>
        </div>
      </section>

      <p className="text-xs text-slate-muted">{module.sourceNotes}</p>

      <div className="flex items-center gap-3 border-t border-border pt-6">
        {completed ? (
          <span className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Marked as reviewed
          </span>
        ) : (
          <Button onClick={handleComplete} disabled={pending}>
            {pending ? "Saving…" : "I've reviewed the material"}
          </Button>
        )}
        {completed && <Button variant="outline" onClick={onAdvance}>Continue to Assess</Button>}
      </div>
    </div>
  );
}

function toInsightContent(insight: ModuleDefinition["insights"][number]): InsightContent {
  return {
    id: insight.id,
    category: insight.category,
    title: insight.title,
    summary: insight.summary,
    application: insight.application,
    verified: true,
  };
}
