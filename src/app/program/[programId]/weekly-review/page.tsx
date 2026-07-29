import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { listModuleProgress } from "@/repositories/module-progress";
import { listScorecards, listWeeklyReviews } from "@/repositories/weekly-reviews";
import { listLeadMeasureEntries } from "@/repositories/lead-measures";
import { determineCurrentModuleSlug } from "@/services/progress";
import { getModuleBySlug } from "@/content/modules";
import { WeeklyReviewForm } from "@/components/forms/weekly-review-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_WEEKLY_SCORE } from "@/services/scorecard";

export const metadata: Metadata = { title: "Weekly review" };

export default async function WeeklyReviewPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const program = await repo.getProgram(programId);
  if (!program) notFound();

  const moduleProgressRows = await listModuleProgress(programId, user.id);
  const currentModuleSlug = determineCurrentModuleSlug(moduleProgressRows);
  const moduleDefinition = getModuleBySlug(currentModuleSlug);
  if (!moduleDefinition) notFound();

  const [reviews, scorecards, leadMeasureEntries] = await Promise.all([
    listWeeklyReviews(programId, user.id),
    listScorecards(programId, user.id),
    listLeadMeasureEntries(programId, user.id, currentModuleSlug),
  ]);

  const existingReview = reviews.find((r) => r.weekNumber === moduleDefinition.week) ?? null;
  const scorecard = scorecards.find((s) => s.weekNumber === moduleDefinition.week) ?? null;
  const latestLeadMeasure = [...leadMeasureEntries].sort((a, b) =>
    b.entryDate.localeCompare(a.entryDate),
  )[0];

  return (
    <div className="container-page py-10">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
        Week {moduleDefinition.week} of 10
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">
        Weekly review — {moduleDefinition.title}
      </h1>
      <p className="text-slate mt-2 max-w-2xl">
        Ten questions, honestly answered, are worth more than a perfect week.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <WeeklyReviewForm
          programId={programId}
          weekNumber={moduleDefinition.week}
          moduleSlug={currentModuleSlug}
          existing={existingReview}
        />

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">One-page summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <SummaryRow label="Week" value={`${moduleDefinition.week} of 10`} />
            <SummaryRow label="Module" value={moduleDefinition.title} />
            <SummaryRow
              label="Score"
              value={scorecard ? `${scorecard.totalScore} / ${MAX_WEEKLY_SCORE}` : "Not yet scored"}
            />
            <SummaryRow label="Key lesson" value={existingReview?.lesson || "—"} />
            <SummaryRow label="Biggest win" value={existingReview?.biggestWin || "—"} />
            <SummaryRow label="Main obstacle" value={existingReview?.mainObstacle || "—"} />
            <SummaryRow
              label="Lead measure"
              value={
                latestLeadMeasure
                  ? `${latestLeadMeasure.actual} (${latestLeadMeasure.entryDate})`
                  : "Not recorded"
              }
            />
            <SummaryRow label="Actions completed" value={existingReview?.actionsCompleted || "—"} />
            <SummaryRow
              label="Carry-forward commitment"
              value={existingReview?.nextWeekPriority || "—"}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-slate-muted text-xs font-semibold tracking-wide uppercase">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}
