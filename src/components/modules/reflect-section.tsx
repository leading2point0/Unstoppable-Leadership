"use client";

import { useState, useTransition } from "react";
import type { ModuleDefinition } from "@/content/modules";
import { REFLECTION_PROMPTS } from "@/content/modules/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { submitReflectionAction } from "@/lib/actions/module-actions";

export function ReflectSection({
  module,
  programId,
  alreadyReflected,
  onAdvance,
}: {
  module: ModuleDefinition;
  programId: string;
  alreadyReflected: boolean;
  onAdvance: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(alreadyReflected);

  function handleSubmit() {
    startTransition(async () => {
      await submitReflectionAction(programId, module.slug, responses);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Reflect</h2>
        <p className="mt-2 text-sm text-slate">Short answers are fine. Honesty matters more than length.</p>
      </div>

      <div className="space-y-5">
        {REFLECTION_PROMPTS.map((prompt) => (
          <div key={prompt.id} className="space-y-2">
            <Label htmlFor={`reflect-${prompt.id}`}>{prompt.prompt}</Label>
            <Textarea
              id={`reflect-${prompt.id}`}
              rows={2}
              value={responses[prompt.id] ?? ""}
              onChange={(e) => setResponses((prev) => ({ ...prev, [prompt.id]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={pending}>
        {pending ? "Saving…" : "Save reflection"}
      </Button>

      {saved && (
        <Button variant="outline" onClick={onAdvance}>
          Continue to Complete
        </Button>
      )}
    </div>
  );
}
