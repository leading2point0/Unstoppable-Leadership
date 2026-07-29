"use client";

import { useId, useState, useTransition } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ListEditor } from "@/components/forms/list-editor";
import {
  saveOperatingSystemAction,
  finalizeOperatingSystemAction,
} from "@/lib/actions/operating-system-actions";
import {
  DEFAULT_DECISION_FILTER,
  DEFAULT_WEEKLY_REVIEW_QUESTIONS,
} from "@/schemas/operating-system";
import { operatingSystemToMarkdown } from "@/lib/operating-system-export";
import { downloadTextFile } from "@/lib/journal-export";
import type { OperatingSystem } from "@/repositories/operating-system";

export function OperatingSystemForm({
  programId,
  existing,
}: {
  programId: string;
  existing: OperatingSystem | null;
}) {
  const [pending, startTransition] = useTransition();
  const [identityStatement, setIdentityStatement] = useState(existing?.identityStatement ?? "");
  const [goal, setGoal] = useState(existing?.primaryGoal?.goal ?? "");
  const [deadline, setDeadline] = useState(existing?.primaryGoal?.deadline ?? "");
  const [baseline, setBaseline] = useState(existing?.primaryGoal?.baseline ?? "");
  const [target, setTarget] = useState(existing?.primaryGoal?.target ?? "");
  const [leadMeasure, setLeadMeasure] = useState(existing?.primaryGoal?.leadMeasure ?? "");
  const [bigThree, setBigThree] = useState<string[]>(
    (existing?.bigThree as string[]) ?? ["", "", ""],
  );
  const [dailyNonNegotiables, setDailyNonNegotiables] = useState<string[]>(
    (existing?.dailyNonNegotiables as string[]) ?? ["", "", "", "", ""],
  );
  const [weeklyReviewQuestions, setWeeklyReviewQuestions] = useState<string[]>(
    (existing?.weeklyReviewQuestions as string[]) ?? [...DEFAULT_WEEKLY_REVIEW_QUESTIONS],
  );
  const [decisionFilter, setDecisionFilter] = useState<string[]>(
    (existing?.decisionFilter as string[]) ?? [...DEFAULT_DECISION_FILTER],
  );
  const [setbackProtocol, setSetbackProtocol] = useState<string[]>(
    (existing?.setbackProtocol as string[]) ?? ["", "", ""],
  );
  const [leadership, setLeadership] = useState(
    existing?.leadershipCommitments ?? {
      expectations: "",
      accountability: "",
      support: "",
      feedback: "",
      recognition: "",
    },
  );
  const [habits, setHabits] = useState(
    existing?.habitArchitecture ?? {
      morning: "",
      workStart: "",
      shutdown: "",
      health: "",
      relationships: "",
      learning: "",
    },
  );

  function currentData() {
    return {
      programId,
      identityStatement: identityStatement || undefined,
      primaryGoal: goal ? { goal, deadline, baseline, target, leadMeasure } : undefined,
      bigThree: bigThree.filter(Boolean),
      dailyNonNegotiables: dailyNonNegotiables.filter(Boolean),
      weeklyReviewQuestions: weeklyReviewQuestions.filter(Boolean),
      decisionFilter: decisionFilter.filter(Boolean),
      setbackProtocol: setbackProtocol.filter(Boolean),
      leadershipCommitments: leadership,
      habitArchitecture: habits,
    };
  }

  function handleSave() {
    startTransition(async () => {
      await saveOperatingSystemAction(currentData());
    });
  }

  function handleFinalize() {
    startTransition(async () => {
      await saveOperatingSystemAction(currentData());
      await finalizeOperatingSystemAction(programId);
    });
  }

  function exportMarkdown() {
    downloadTextFile(
      "unstoppable-operating-system.md",
      operatingSystemToMarkdown(currentData()),
      "text/markdown",
    );
  }
  function exportJson() {
    downloadTextFile(
      "unstoppable-operating-system.json",
      JSON.stringify(currentData(), null, 2),
      "application/json",
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-wrap gap-2 print:hidden">
        <Button onClick={handleSave} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button variant="outline" onClick={exportMarkdown}>
          <Download className="h-4 w-4" aria-hidden="true" /> Markdown
        </Button>
        <Button variant="outline" onClick={exportJson}>
          <Download className="h-4 w-4" aria-hidden="true" /> JSON
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="h-4 w-4" aria-hidden="true" /> Print / Save as PDF
        </Button>
        <Button variant="accent" onClick={handleFinalize} disabled={pending}>
          {existing?.finalizedAt ? "Finalized" : "Finalize"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>&ldquo;I am becoming a person who…&rdquo;</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={2}
            aria-label="Identity statement"
            value={identityStatement}
            onChange={(e) => setIdentityStatement(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primary twelve-month goal</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Goal" value={goal} onChange={setGoal} />
          <Field label="Deadline" value={deadline} onChange={setDeadline} />
          <Field label="Baseline" value={baseline} onChange={setBaseline} />
          <Field label="Target" value={target} onChange={setTarget} />
          <Field label="Lead measure" value={leadMeasure} onChange={setLeadMeasure} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Big Three priorities</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor label="" items={bigThree} onChange={setBigThree} maxItems={3} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily nonnegotiables</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor
            label=""
            items={dailyNonNegotiables}
            onChange={setDailyNonNegotiables}
            maxItems={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly review process</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor label="" items={weeklyReviewQuestions} onChange={setWeeklyReviewQuestions} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decision filter</CardTitle>
          <CardDescription>Questions to ask before accepting a commitment.</CardDescription>
        </CardHeader>
        <CardContent>
          <ListEditor label="" items={decisionFilter} onChange={setDecisionFilter} maxItems={5} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setback protocol</CardTitle>
        </CardHeader>
        <CardContent>
          <ListEditor label="" items={setbackProtocol} onChange={setSetbackProtocol} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership commitments</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Expectations"
            value={leadership.expectations}
            onChange={(v) => setLeadership({ ...leadership, expectations: v })}
          />
          <Field
            label="Accountability"
            value={leadership.accountability}
            onChange={(v) => setLeadership({ ...leadership, accountability: v })}
          />
          <Field
            label="Support"
            value={leadership.support}
            onChange={(v) => setLeadership({ ...leadership, support: v })}
          />
          <Field
            label="Feedback"
            value={leadership.feedback}
            onChange={(v) => setLeadership({ ...leadership, feedback: v })}
          />
          <Field
            label="Recognition"
            value={leadership.recognition}
            onChange={(v) => setLeadership({ ...leadership, recognition: v })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Habit architecture</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Morning routine"
            value={habits.morning}
            onChange={(v) => setHabits({ ...habits, morning: v })}
          />
          <Field
            label="Work-start routine"
            value={habits.workStart}
            onChange={(v) => setHabits({ ...habits, workStart: v })}
          />
          <Field
            label="Shutdown routine"
            value={habits.shutdown}
            onChange={(v) => setHabits({ ...habits, shutdown: v })}
          />
          <Field
            label="Health routine"
            value={habits.health}
            onChange={(v) => setHabits({ ...habits, health: v })}
          />
          <Field
            label="Relationship/family routine"
            value={habits.relationships}
            onChange={(v) => setHabits({ ...habits, relationships: v })}
          />
          <Field
            label="Learning routine"
            value={habits.learning}
            onChange={(v) => setHabits({ ...habits, learning: v })}
          />
        </CardContent>
      </Card>
    </div>
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
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
