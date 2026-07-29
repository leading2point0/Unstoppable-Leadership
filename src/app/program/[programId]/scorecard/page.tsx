import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { listScorecards } from "@/repositories/weekly-reviews";
import { PROGRAM_MODULES } from "@/content/modules";
import { ScorecardChart } from "@/components/charts/scorecard-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MAX_WEEKLY_SCORE } from "@/services/scorecard";

export const metadata: Metadata = { title: "Scorecard" };

export default async function ScorecardPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const user = await requireUser();
  const repo = createProgramRepository(user.id);
  const program = await repo.getProgram(programId);
  if (!program) notFound();

  const scorecards = await listScorecards(programId, user.id);
  const scorecardByWeek = new Map(scorecards.map((s) => [s.weekNumber, s]));

  const chartData = PROGRAM_MODULES.map((m) => ({
    week: m.week,
    score: scorecardByWeek.get(m.week)?.totalScore ?? 0,
  }));

  return (
    <div className="container-page py-10">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Scorecard</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Ten-week transformation scorecard</h1>
      <p className="text-slate mt-2 max-w-2xl">
        This measures program execution — whether the scheduled work of each week happened — not
        your personal worth. A quiet week is information, not a verdict.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Weekly score</CardTitle>
          <CardDescription>Each week is scored out of {MAX_WEEKLY_SCORE} points.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScorecardChart data={chartData} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Module comparison</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-border text-slate-muted border-b text-xs tracking-wide uppercase">
                <th className="py-2 pr-4">Week</th>
                <th className="py-2 pr-4">Module</th>
                <th className="py-2 pr-4">Review</th>
                <th className="py-2 pr-4">Assess</th>
                <th className="py-2 pr-4">Planned</th>
                <th className="py-2 pr-4">Scheduled</th>
                <th className="py-2 pr-4">Difficult</th>
                <th className="py-2 pr-4">Lead measure</th>
                <th className="py-2 pr-4">Evidence</th>
                <th className="py-2 pr-4">Review done</th>
                <th className="py-2 pr-4">Next-week commit</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {PROGRAM_MODULES.map((m) => {
                const sc = scorecardByWeek.get(m.week);
                return (
                  <tr key={m.slug} className="border-border border-b last:border-0">
                    <td className="py-2 pr-4">{m.week}</td>
                    <td className="py-2 pr-4">{m.title}</td>
                    <td className="py-2 pr-4">{point(sc?.conceptReviewPoint)}</td>
                    <td className="py-2 pr-4">{point(sc?.selfAssessmentPoint)}</td>
                    <td className="py-2 pr-4">{point(sc?.actionsPlannedPoint)}</td>
                    <td className="py-2 pr-4">{point(sc?.actionsScheduledPoint)}</td>
                    <td className="py-2 pr-4">{sc?.difficultActionPoints ?? 0}/2</td>
                    <td className="py-2 pr-4">{point(sc?.leadMeasurePoint)}</td>
                    <td className="py-2 pr-4">{point(sc?.evidencePoint)}</td>
                    <td className="py-2 pr-4">{point(sc?.weeklyReviewPoint)}</td>
                    <td className="py-2 pr-4">{point(sc?.nextWeekCommitmentPoint)}</td>
                    <td className="py-2 pr-4 font-medium">
                      {sc?.totalScore ?? 0}/{MAX_WEEKLY_SCORE}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function point(value: number | undefined) {
  return value ? "✓" : "—";
}
