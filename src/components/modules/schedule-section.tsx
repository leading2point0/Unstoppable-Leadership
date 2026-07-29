"use client";

import { useTransition } from "react";
import { Download } from "lucide-react";
import type { ModuleDefinition } from "@/content/modules";
import type { ImplementationAction } from "@/repositories/actions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateModuleActionAction, markScheduleCompleteAction } from "@/lib/actions/module-actions";
import { buildIcsFile, recurrenceToRRule } from "@/lib/ics";
import type { Recurrence } from "@/types/domain";

const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
  { value: "none", label: "One time" },
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every two weeks" },
  { value: "monthly", label: "Monthly" },
];

export function ScheduleSection({
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
  const [pending, startTransition] = useTransition();
  const scheduledCount = actions.filter((a) => a.dueDate).length;

  function handleContinue() {
    startTransition(async () => {
      await markScheduleCompleteAction(programId, module.slug);
      onAdvance();
    });
  }

  function downloadIcs(action: ImplementationAction) {
    if (!action.dueDate) return;
    const [hours, minutes] = (action.dueTime ?? "09:00").split(":").map(Number);
    const start = new Date(action.dueDate);
    start.setHours(hours ?? 9, minutes ?? 0, 0, 0);

    const ics = buildIcsFile({
      uid: `${action.id}@unstoppable-action-lab`,
      title: action.title,
      description: action.description ?? undefined,
      start,
      durationMinutes: action.estimatedEffortMinutes ?? 30,
      recurrenceRule: recurrenceToRRule(action.recurrence),
    });

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${action.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Schedule your commitments</h2>
        <p className="mt-2 text-sm text-slate">
          A due date is what turns an intention into a commitment. Add a date, time, and context for each action.
        </p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <Card key={action.id}>
            <CardContent className="space-y-4 pt-6">
              <p className="font-medium">{action.title}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Date">
                  <Input
                    type="date"
                    defaultValue={action.dueDate ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateModuleActionAction(action.id, programId, { dueDate: e.target.value || undefined });
                      })
                    }
                  />
                </Field>
                <Field label="Time">
                  <Input
                    type="time"
                    defaultValue={action.dueTime ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateModuleActionAction(action.id, programId, { dueTime: e.target.value || undefined });
                      })
                    }
                  />
                </Field>
                <Field label="Recurrence">
                  <Select
                    defaultValue={action.recurrence}
                    onValueChange={(v) =>
                      startTransition(async () => {
                        await updateModuleActionAction(action.id, programId, { recurrence: v as Recurrence });
                      })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RECURRENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Context or location">
                  <Input
                    defaultValue={action.contextOrLocation ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateModuleActionAction(action.id, programId, { contextOrLocation: e.target.value || undefined });
                      })
                    }
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Trigger">
                  <Input
                    placeholder="What cues you to start?"
                    defaultValue={action.trigger ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateModuleActionAction(action.id, programId, { trigger: e.target.value || undefined });
                      })
                    }
                  />
                </Field>
                <Field label="Reminder text">
                  <Input
                    defaultValue={action.reminderText ?? ""}
                    onBlur={(e) =>
                      startTransition(async () => {
                        await updateModuleActionAction(action.id, programId, { reminderText: e.target.value || undefined });
                      })
                    }
                  />
                </Field>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => downloadIcs(action)} disabled={!action.dueDate}>
                <Download className="h-4 w-4" aria-hidden="true" /> Download calendar file
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleContinue} disabled={pending || scheduledCount === 0}>
        Continue to Track
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">{label}</p>
      {children}
    </div>
  );
}
