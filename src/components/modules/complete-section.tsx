"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import type { ModuleDefinition } from "@/content/modules";
import { COMPLETION_AFFIRMATIONS } from "@/content/modules/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { completeModuleAction } from "@/lib/actions/module-actions";

export function CompleteSection({
  module,
  programId,
  alreadyCompleted,
}: {
  module: ModuleDefinition;
  programId: string;
  alreadyCompleted: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COMPLETION_AFFIRMATIONS.map((a) => [a.id, alreadyCompleted])),
  );

  const allChecked = COMPLETION_AFFIRMATIONS.every((a) => checked[a.id]);

  function handleComplete() {
    startTransition(async () => {
      await completeModuleAction(programId, module.slug);
      router.push(`/program/${programId}`);
      router.refresh();
    });
  }

  if (alreadyCompleted) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-success bg-success-bg p-6 text-success">
        <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        <p>This module is complete. You can revisit any section any time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Complete this module</h2>
        <p className="mt-2 text-sm text-slate">
          Honest, incomplete progress with a documented lesson still counts. This isn&apos;t about a perfect week.
        </p>
      </div>

      <div className="space-y-3">
        {COMPLETION_AFFIRMATIONS.map((affirmation) => (
          <div key={affirmation.id} className="flex items-center gap-3">
            <Checkbox
              id={`affirm-${affirmation.id}`}
              checked={checked[affirmation.id]}
              onCheckedChange={(value) => setChecked((prev) => ({ ...prev, [affirmation.id]: value === true }))}
            />
            <Label htmlFor={`affirm-${affirmation.id}`} className="font-normal">
              {affirmation.label}
            </Label>
          </div>
        ))}
      </div>

      <Button onClick={handleComplete} disabled={!allChecked || pending}>
        {pending ? "Completing…" : "Complete this week"}
      </Button>
    </div>
  );
}
