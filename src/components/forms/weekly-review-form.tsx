"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveWeeklyReviewAction } from "@/lib/actions/weekly-review-actions";
import type { WeeklyReview } from "@/repositories/weekly-reviews";

export function WeeklyReviewForm({
  programId,
  weekNumber,
  moduleSlug,
  existing,
}: {
  programId: string;
  weekNumber: number;
  moduleSlug: string;
  existing: WeeklyReview | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    measurableResult: existing?.measurableResult ?? "",
    actionsCompleted: existing?.actionsCompleted ?? "",
    actionsAvoided: existing?.actionsAvoided ?? "",
    explanationGiven: existing?.explanationGiven ?? "",
    explanationValidity: existing?.explanationValidity ?? "",
    lesson: existing?.lesson ?? "",
    continueDoing: existing?.continueDoing ?? "",
    stopDoing: existing?.stopDoing ?? "",
    changeGoing: existing?.changeGoing ?? "",
    nextWeekPriority: existing?.nextWeekPriority ?? "",
    biggestWin: existing?.biggestWin ?? "",
    mainObstacle: existing?.mainObstacle ?? "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    if (!form.nextWeekPriority.trim()) return;
    startTransition(async () => {
      await saveWeeklyReviewAction({
        programId,
        weekNumber,
        moduleSlug,
        ...form,
        explanationValidity: (form.explanationValidity || undefined) as
          "valid" | "incomplete" | "excuse" | undefined,
      });
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-6">
        <QField
          label="What measurable result did I produce?"
          value={form.measurableResult}
          onChange={(v) => set("measurableResult", v)}
        />
        <QField
          label="Which planned actions did I complete?"
          value={form.actionsCompleted}
          onChange={(v) => set("actionsCompleted", v)}
        />
        <QField
          label="Which actions did I avoid?"
          value={form.actionsAvoided}
          onChange={(v) => set("actionsAvoided", v)}
        />
        <QField
          label="What explanation am I giving myself?"
          value={form.explanationGiven}
          onChange={(v) => set("explanationGiven", v)}
        />
        <div className="space-y-2">
          <Label>Is that explanation valid, incomplete, or an excuse?</Label>
          <Select
            value={form.explanationValidity}
            onValueChange={(v) => set("explanationValidity", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose one" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              <SelectItem value="excuse">Excuse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <QField label="What did I learn?" value={form.lesson} onChange={(v) => set("lesson", v)} />
        <QField
          label="What should I continue?"
          value={form.continueDoing}
          onChange={(v) => set("continueDoing", v)}
        />
        <QField
          label="What should I stop?"
          value={form.stopDoing}
          onChange={(v) => set("stopDoing", v)}
        />
        <QField
          label="What should I change?"
          value={form.changeGoing}
          onChange={(v) => set("changeGoing", v)}
        />
        <div className="space-y-2">
          <Label htmlFor="next-week-priority">
            What is next week&apos;s most important action?
          </Label>
          <Input
            id="next-week-priority"
            value={form.nextWeekPriority}
            onChange={(e) => set("nextWeekPriority", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <QField
            label="Biggest win"
            value={form.biggestWin}
            onChange={(v) => set("biggestWin", v)}
            short
          />
          <QField
            label="Main obstacle"
            value={form.mainObstacle}
            onChange={(v) => set("mainObstacle", v)}
            short
          />
        </div>

        <Button onClick={handleSubmit} disabled={pending || !form.nextWeekPriority.trim()}>
          {pending ? "Saving…" : "Save weekly review"}
        </Button>
      </CardContent>
    </Card>
  );
}

function QField({
  label,
  value,
  onChange,
  short,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  short?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={short ? 2 : 3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
