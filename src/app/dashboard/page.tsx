import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { AlertTriangle, ArrowRight, CalendarClock, Flame, ListChecks, Target } from "lucide-react";
import { requireUser } from "@/lib/auth-guard";
import { getDashboardData } from "@/services/dashboard";
import { ProgressRing } from "@/components/progress/progress-ring";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MAX_WEEKLY_SCORE } from "@/services/scorecard";

export const metadata: Metadata = { title: "Dashboard" };

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function DashboardPage() {
  const user = await requireUser();
  const data = await getDashboardData(user.id);

  if (!data.program) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Dashboard</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">No program yet</h1>
        <p className="mx-auto mt-3 max-w-md text-slate">
          Start your ten-week program to see your progress, actions, habits, and weekly reviews here.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/program/new">Start My Program</Link>
        </Button>
      </div>
    );
  }

  const { program } = data;

  return (
    <div className="container-page py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Week {data.currentWeek} of 10
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">
            Welcome back{program.displayName ? `, ${program.displayName}` : ""}
          </h1>
          {data.currentModuleTitle && (
            <p className="mt-2 text-slate">
              Current module: <span className="font-medium text-foreground">{data.currentModuleTitle}</span>
            </p>
          )}
        </div>
        <Button asChild>
          <Link href={`/program/${program.id}/module/${data.currentModuleSlug}`}>
            Continue this week&apos;s module <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-6 pt-6">
            <ProgressRing percent={data.completionPercent} label={`${data.completionPercent} percent of the program complete`} />
            <div>
              <p className="text-sm text-slate">Program progress</p>
              <p className="mt-1 text-sm text-slate">{data.completionPercent === 100 ? "All ten weeks complete" : `Week ${data.currentWeek} of 10`}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">This week&apos;s score</CardTitle>
            <CardDescription>Measures execution, not personal worth.</CardDescription>
          </CardHeader>
          <CardContent>
            {data.weeklyScoreTotal === null ? (
              <p className="text-sm text-slate">Complete this week&apos;s work to see your score.</p>
            ) : (
              <p className="font-serif text-3xl font-semibold">
                {data.weeklyScoreTotal} <span className="text-base font-sans text-slate">/ {MAX_WEEKLY_SCORE}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-4 w-4 text-accent" aria-hidden="true" /> Reflection streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-serif text-3xl font-semibold">{data.reflectionStreak} <span className="text-base font-sans text-slate">days</span></p>
            <p className="mt-1 text-sm text-slate">Consecutive days with a journal entry.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-accent" aria-hidden="true" /> Today&apos;s most important action
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recommendedNextAction ? (
              <div>
                <p className="font-medium">{data.recommendedNextAction.title}</p>
                {data.recommendedNextAction.nextPhysicalAction && (
                  <p className="mt-1 text-sm text-slate">{data.recommendedNextAction.nextPhysicalAction}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate">No action scheduled for today yet.</p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/actions">Open Actions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className={data.overdueActions.length > 0 ? "border-caution" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-caution" aria-hidden="true" /> Overdue commitments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.overdueActions.length === 0 ? (
              <p className="text-sm text-slate">Nothing overdue. Good standing.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {data.overdueActions.slice(0, 4).map((a) => (
                  <li key={a.id} className="flex items-center justify-between">
                    <span>{a.title}</span>
                    <Badge variant="caution">{a.dueDate}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current habits</CardTitle>
          </CardHeader>
          <CardContent>
            {data.habitsWithConsistency.length === 0 ? (
              <p className="text-sm text-slate">No habits yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data.habitsWithConsistency.slice(0, 4).map(({ habit, consistency, streak }) => (
                  <li key={habit.id} className="flex items-center justify-between">
                    <span>{habit.name}</span>
                    <span className="text-slate">{consistency}% · {streak}d streak</span>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/habits">Open Habits</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-accent" aria-hidden="true" /> Biggest current goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate">{data.primaryGoal || "No goal recorded yet."}</p>
            {data.bigThree.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm">
                {data.bigThree.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="h-4 w-4 text-accent" aria-hidden="true" /> Next scheduled review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate">Every {WEEKDAY_NAMES[data.nextReviewDay]}</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href={`/program/${program.id}/weekly-review`}>Go to weekly review</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent evidence</CardTitle>
          <CardDescription>What did you do — not merely intend to do?</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentEvidence.length === 0 ? (
            <p className="text-sm text-slate">No evidence recorded yet this week.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.recentEvidence.map((e) => (
                <li key={e.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <span>{e.description}</span>
                  <span className="text-slate">{format(new Date(e.completionDate), "MMM d")}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
