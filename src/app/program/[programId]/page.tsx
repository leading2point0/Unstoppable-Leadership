import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { requireUser } from "@/lib/auth-guard";
import { createProgramRepository } from "@/repositories/programs";
import { listModuleProgress } from "@/repositories/module-progress";
import { calculateProgramCompletionPercent, getModuleAvailability } from "@/services/progress";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your program" };

export default async function ProgramOverviewPage({
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
  const completionPercent = calculateProgramCompletionPercent(moduleProgressRows);
  const availability = getModuleAvailability(moduleProgressRows);

  return (
    <div className="container-page py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
            {program.displayName ? `${program.displayName}'s program` : "Your program"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold">{program.title}</h1>
          <p className="text-slate mt-2">
            Started {new Date(program.startDate).toLocaleDateString()} · Challenge level:{" "}
            <span className="capitalize">{program.challengeLevel}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-40">
            <p className="text-slate text-right text-sm">{completionPercent}% complete</p>
            <Progress
              value={completionPercent}
              className="mt-1"
              aria-label={`${completionPercent}% of the ten-week program complete`}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {availability.map(({ slug, week, title, status }) => (
          <Card key={slug} className={status === "locked" ? "opacity-60" : ""}>
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
              <div>
                <Badge variant="outline">Week {week}</Badge>
                <CardTitle className="mt-2 text-lg">{title}</CardTitle>
              </div>
              <StatusIcon status={status} />
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <StatusLabel status={status} />
              {status === "locked" ? (
                <Button size="sm" variant="ghost" disabled>
                  Locked
                </Button>
              ) : (
                <Button asChild size="sm" variant={status === "completed" ? "outline" : "default"}>
                  <Link href={`/program/${programId}/module/${slug}`}>
                    {status === "completed"
                      ? "Review"
                      : status === "in-progress"
                        ? "Continue"
                        : "Start"}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {completionPercent === 100 && (
        <Card className="border-accent mt-10">
          <CardHeader>
            <CardTitle>You&apos;ve completed all ten weeks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate text-sm">
              Build your final personal operating system from everything you recorded.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/program/${programId}/operating-system`}>Build my operating system</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed")
    return <CheckCircle2 className="text-success h-5 w-5" aria-hidden="true" />;
  if (status === "locked") return <Lock className="text-neutral h-5 w-5" aria-hidden="true" />;
  return <PlayCircle className="text-accent h-5 w-5" aria-hidden="true" />;
}

function StatusLabel({ status }: { status: string }) {
  const variant = status === "completed" ? "success" : status === "locked" ? "neutral" : "accent";
  const label =
    status === "completed"
      ? "Completed"
      : status === "locked"
        ? "Locked"
        : status === "in-progress"
          ? "In progress"
          : "Available";
  return <Badge variant={variant as "success" | "neutral" | "accent"}>{label}</Badge>;
}
