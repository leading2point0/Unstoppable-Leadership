"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import type { ModuleDefinition } from "@/content/modules";
import type { LeadMeasureEntry } from "@/repositories/lead-measures";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LeadMeasureChart } from "@/components/charts/lead-measure-chart";
import { logModuleLeadMeasureAction } from "@/lib/actions/module-actions";

export function TrackSection({
  module,
  programId,
  entries,
  onAdvance,
}: {
  module: ModuleDefinition;
  programId: string;
  entries: LeadMeasureEntry[];
  onAdvance: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState("");

  const chartData = [...entries]
    .sort((a, b) => a.entryDate.localeCompare(b.entryDate))
    .map((e) => ({ date: format(new Date(e.entryDate), "MMM d"), actual: Number(e.actual) }));

  function handleSubmit() {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    startTransition(async () => {
      await logModuleLeadMeasureAction(programId, module.slug, numeric);
      setValue("");
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Weekly lead measure</h2>
        <p className="text-slate mt-2 text-sm">{module.leadMeasure.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{module.leadMeasure.label}</CardTitle>
          {module.leadMeasure.defaultTarget && (
            <CardDescription>
              Target: {module.leadMeasure.defaultTarget} {module.leadMeasure.unit}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <LeadMeasureChart data={chartData} unit={module.leadMeasure.unit} />

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <Label htmlFor="lead-measure-value">
                Today&apos;s actual{module.leadMeasure.unit ? ` (${module.leadMeasure.unit})` : ""}
              </Label>
              <Input
                id="lead-measure-value"
                type="number"
                step="any"
                className="mt-1 w-32"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmit} disabled={pending || value === ""}>
              {pending ? "Saving…" : "Log entry"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Button variant="outline" onClick={onAdvance}>
          Continue to Reflect
        </Button>
      )}
    </div>
  );
}
