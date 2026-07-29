"use client";

import { useState, useTransition } from "react";
import type { ModuleDefinition } from "@/content/modules";
import { ASSESSMENT_SCALE } from "@/content/modules/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { submitAssessmentAction } from "@/lib/actions/module-actions";
import { summarizeAssessment } from "@/services/assessment";

interface Existing {
  responses: { questionId: string; currentScore: number; desiredScore: number }[];
}

export function AssessSection({
  module,
  programId,
  existing,
  onAdvance,
}: {
  module: ModuleDefinition;
  programId: string;
  existing: Existing | null;
  onAdvance: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [scores, setScores] = useState<Record<string, { current: number; desired: number }>>(() => {
    const initial: Record<string, { current: number; desired: number }> = {};
    for (const q of module.assessmentQuestions) {
      const found = existing?.responses.find((r) => r.questionId === q.id);
      initial[q.id] = { current: found?.currentScore ?? 3, desired: found?.desiredScore ?? 4 };
    }
    return initial;
  });
  const [summary, setSummary] = useState(() =>
    existing
      ? summarizeAssessment(existing.responses.map((r) => ({ questionId: r.questionId, currentScore: r.currentScore, desiredScore: r.desiredScore })))
      : null,
  );

  function handleSubmit() {
    const responses = module.assessmentQuestions.map((q) => ({
      questionId: q.id,
      currentScore: scores[q.id].current,
      desiredScore: scores[q.id].desired,
    }));
    startTransition(async () => {
      const result = await submitAssessmentAction(programId, module.slug, responses);
      setSummary(result);
    });
  }

  const largestGapQuestion = module.assessmentQuestions.find((q) => q.id === summary?.largestGapQuestionId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold">Self-assessment</h2>
        <p className="mt-2 text-sm text-slate">
          This is a reflective score to help you notice patterns — not a clinical or diagnostic instrument. Rate where
          you are today, and where you&apos;d like to be.
        </p>
      </div>

      <div className="space-y-6">
        {module.assessmentQuestions.map((question) => (
          <Card key={question.id}>
            <CardContent className="space-y-3 pt-6">
              <p className="font-medium">{question.prompt}</p>
              <ScoreRow
                label="Current"
                value={scores[question.id].current}
                onChange={(value) => setScores((prev) => ({ ...prev, [question.id]: { ...prev[question.id], current: value } }))}
              />
              <ScoreRow
                label="Desired"
                value={scores[question.id].desired}
                onChange={(value) => setScores((prev) => ({ ...prev, [question.id]: { ...prev[question.id], desired: value } }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={pending}>
        {pending ? "Saving…" : "Save self-assessment"}
      </Button>

      {summary && (
        <Card className="border-accent">
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
            <Stat label="Current score" value={summary.currentAverage.toFixed(1)} />
            <Stat label="Desired score" value={summary.desiredAverage.toFixed(1)} />
            <Stat label="Largest gap" value={largestGapQuestion?.prompt ?? "—"} isText />
          </CardContent>
        </Card>
      )}

      {summary && (
        <Button variant="outline" onClick={onAdvance}>
          Continue to Apply
        </Button>
      )}
    </div>
  );
}

function ScoreRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-muted">{label}</p>
      <div role="radiogroup" aria-label={label} className="mt-1 flex gap-2">
        {ASSESSMENT_SCALE.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={`h-9 w-9 rounded-full border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
              value === option.value ? "border-accent bg-accent text-accent-foreground" : "border-border-strong hover:bg-surface-muted"
            }`}
          >
            {option.value}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, isText }: { label: string; value: string; isText?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-muted">{label}</p>
      <p className={isText ? "mt-1 text-sm" : "mt-1 font-serif text-2xl font-semibold"}>{value}</p>
    </div>
  );
}
