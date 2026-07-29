"use client";

import { useId, useState, useTransition } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createJournalEntryAction } from "@/lib/actions/journal-actions";
import { RUTHLESS_REVIEW_PROMPTS } from "@/schemas/journal";

export function JournalEntryForm({ programId }: { programId: string }) {
  const [pending, startTransition] = useTransition();
  const [ruthless, setRuthless] = useState(false);
  const [body, setBody] = useState("");
  const [ruthlessAnswers, setRuthlessAnswers] = useState<Record<string, string>>({});
  const [wins, setWins] = useState("");
  const [resistance, setResistance] = useState("");
  const [lessons, setLessons] = useState("");
  const [followUpAction, setFollowUpAction] = useState("");

  function reset() {
    setBody("");
    setRuthlessAnswers({});
    setWins("");
    setResistance("");
    setLessons("");
    setFollowUpAction("");
  }

  function handleSubmit() {
    const combinedBody = ruthless
      ? RUTHLESS_REVIEW_PROMPTS.map((prompt) => `${prompt}\n${ruthlessAnswers[prompt] ?? ""}`).join(
          "\n\n",
        )
      : body;

    startTransition(async () => {
      await createJournalEntryAction({
        programId,
        entryDate: format(new Date(), "yyyy-MM-dd"),
        mode: ruthless ? "ruthless-review" : "standard",
        wins: wins || undefined,
        resistance: resistance || undefined,
        lessons: lessons || undefined,
        followUpAction: followUpAction || undefined,
        body: combinedBody || undefined,
        tags: ruthless ? ["ruthless-review"] : [],
        sharingLevel: "private",
      });
      reset();
    });
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">New entry — private by default</p>
          <div className="flex items-center gap-2">
            <Label htmlFor="ruthless-toggle" className="text-sm font-normal">
              Ruthless Review mode
            </Label>
            <Switch id="ruthless-toggle" checked={ruthless} onCheckedChange={setRuthless} />
          </div>
        </div>

        {ruthless ? (
          <div className="space-y-3">
            {RUTHLESS_REVIEW_PROMPTS.map((prompt, index) => {
              const fieldId = `ruthless-${index}`;
              return (
                <div key={prompt} className="space-y-1">
                  <Label htmlFor={fieldId} className="text-sm font-normal">
                    {prompt}
                  </Label>
                  <Textarea
                    id={fieldId}
                    rows={2}
                    value={ruthlessAnswers[prompt] ?? ""}
                    onChange={(e) =>
                      setRuthlessAnswers((prev) => ({ ...prev, [prompt]: e.target.value }))
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Wins" value={wins} onChange={setWins} />
            <Field label="Resistance" value={resistance} onChange={setResistance} />
            <Field label="Lessons" value={lessons} onChange={setLessons} />
            <Field label="Follow-up action" value={followUpAction} onChange={setFollowUpAction} />
          </div>
        )}

        <Button onClick={handleSubmit} disabled={pending}>
          {pending ? "Saving…" : "Save entry"}
        </Button>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-normal">
        {label}
      </Label>
      <Textarea id={id} rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
