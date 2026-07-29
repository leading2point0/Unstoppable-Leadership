"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import type { ModuleDefinition } from "@/content/modules";
import type { ImplementationAction } from "@/repositories/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addModuleActionEvidenceAction, updateModuleActionAction } from "@/lib/actions/module-actions";
import type { ActionStatus } from "@/types/domain";

const STATUS_OPTIONS: { value: ActionStatus; label: string }[] = [
  { value: "not-started", label: "Not started" },
  { value: "planned", label: "Planned" },
  { value: "in-progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
  { value: "completed", label: "Completed" },
  { value: "abandoned-intentionally", label: "Abandoned intentionally" },
];

export function ApplySection({
  module,
  programId,
  actions,
  onAdvance,
}: {
  module: ModuleDefinition;
  programId: string;
  actions: ImplementationAction[];
  onAdvance: () => void;
}) {
  const actionsByStep = new Map(actions.map((a) => [a.stepIndex, a]));
  const allHaveStatus = module.implementationSteps.every((step, i) => {
    const action = actionsByStep.get(i);
    return action && action.status !== "not-started";
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Five implementation steps</h2>
        <p className="mt-2 text-sm text-slate">Expand each step to plan it, update its status, and record evidence.</p>
      </div>

      <div className="space-y-4">
        {module.implementationSteps.map((step, index) => {
          const action = actionsByStep.get(index);
          if (!action) return null;
          return <ActionCard key={step.id} programId={programId} moduleSlug={module.slug} step={step} action={action} />;
        })}
      </div>

      {allHaveStatus && (
        <Button variant="outline" onClick={onAdvance}>
          Continue to Schedule
        </Button>
      )}
    </div>
  );
}

function ActionCard({
  programId,
  moduleSlug,
  step,
  action,
}: {
  programId: string;
  moduleSlug: string;
  step: ModuleDefinition["implementationSteps"][number];
  action: ImplementationAction;
}) {
  const [pending, startTransition] = useTransition();
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceText, setEvidenceText] = useState("");

  function setStatus(status: ActionStatus) {
    startTransition(async () => {
      await updateModuleActionAction(action.id, programId, { status });
    });
  }

  function scaleEffort(factor: number, label: string) {
    startTransition(async () => {
      const newEffort = Math.max(5, Math.round((action.estimatedEffortMinutes ?? 20) * factor));
      await updateModuleActionAction(action.id, programId, {
        estimatedEffortMinutes: newEffort,
        description: `[${label}] ${action.description ?? step.instructions}`,
      });
    });
  }

  function submitEvidence() {
    if (!evidenceText.trim()) return;
    startTransition(async () => {
      await addModuleActionEvidenceAction(
        {
          actionId: action.id,
          programId,
          description: evidenceText,
          completionDate: format(new Date(), "yyyy-MM-dd"),
        },
        moduleSlug,
      );
      setEvidenceText("");
      setShowEvidence(false);
    });
  }

  return (
    <details className="group rounded-lg border border-border bg-surface" open={action.status !== "not-started"}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
        <span className="font-medium">{step.title}</span>
        <StatusBadge status={action.status as ActionStatus} />
      </summary>
      <div className="space-y-4 border-t border-border p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">Purpose</p>
          <p className="mt-1 text-sm text-slate">{step.purpose}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">Instructions</p>
          <p className="mt-1 text-sm text-slate">{step.instructions}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-muted" htmlFor={`status-${action.id}`}>
              Status
            </label>
            <Select value={action.status} onValueChange={(v) => setStatus(v as ActionStatus)}>
              <SelectTrigger id={`status-${action.id}`} className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-muted" htmlFor={`effort-${action.id}`}>
              Estimated effort (minutes)
            </label>
            <Input
              id={`effort-${action.id}`}
              type="number"
              className="mt-1"
              defaultValue={action.estimatedEffortMinutes ?? step.defaultEstimatedEffortMinutes}
              onBlur={(e) => {
                const value = Number(e.target.value);
                if (!Number.isNaN(value)) {
                  startTransition(async () => {
                    await updateModuleActionAction(action.id, programId, { estimatedEffortMinutes: value });
                  });
                }
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => scaleEffort(0.6, "Made smaller")} disabled={pending}>
            Make this smaller
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => scaleEffort(1.5, "Made more demanding")} disabled={pending}>
            Make this more demanding
          </Button>
        </div>

        <div>
          {action.blocker && (
            <p className="rounded-md bg-caution-bg px-3 py-2 text-sm text-caution">Blocker: {action.blocker}</p>
          )}
        </div>

        <div>
          {!showEvidence ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowEvidence(true)}>
              + Record evidence
            </Button>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-muted" htmlFor={`evidence-${action.id}`}>
                What did you actually do?
              </label>
              <Textarea
                id={`evidence-${action.id}`}
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={submitEvidence} disabled={pending}>
                  Save evidence
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowEvidence(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </details>
  );
}

function StatusBadge({ status }: { status: ActionStatus }) {
  const map: Record<ActionStatus, { label: string; variant: "neutral" | "accent" | "success" | "critical" | "caution" }> = {
    "not-started": { label: "Not started", variant: "neutral" },
    planned: { label: "Planned", variant: "accent" },
    "in-progress": { label: "In progress", variant: "accent" },
    blocked: { label: "Blocked", variant: "critical" },
    completed: { label: "Completed", variant: "success" },
    "abandoned-intentionally": { label: "Abandoned intentionally", variant: "caution" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
