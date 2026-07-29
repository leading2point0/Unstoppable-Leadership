import Link from "next/link";
import type { Metadata } from "next";
import {
  Compass,
  ShieldCheck,
  Zap,
  Target as TargetIcon,
  Repeat,
  ClipboardCheck,
  BookOpen,
  Search,
  ListChecks,
  CalendarCheck,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PROGRAM_MODULES } from "@/content/modules";
import { INDEPENDENT_STATUS_NOTICE } from "@/content/disclaimers";

export const metadata: Metadata = {
  title: "Unstoppable Action Lab",
  description:
    "A ten-week study and implementation program that turns personal-development principles into scheduled actions, measurable behaviors, and lasting routines.",
};

const outcomes = [
  {
    icon: Compass,
    title: "Clarify personal direction",
    description: "Replace a vague sense of ambition with a written, measurable twelve-month goal.",
  },
  {
    icon: ShieldCheck,
    title: "Replace excuses with responsibility",
    description: "Separate valid constraints from stories that quietly protect inaction.",
  },
  {
    icon: Zap,
    title: "Act despite uncertainty",
    description: "Build the habit of taking the next useful action before you feel fully ready.",
  },
  {
    icon: TargetIcon,
    title: "Convert goals into scheduled behavior",
    description: "Turn intentions into calendar commitments with lead measures you control.",
  },
  {
    icon: Repeat,
    title: "Build resilience and adaptability",
    description: "Prepare for setbacks in advance and treat failure as operational feedback.",
  },
  {
    icon: ClipboardCheck,
    title: "Install repeatable daily systems",
    description: "Design rituals and environments that don't depend on daily motivation.",
  },
];

const howItWorks = [
  {
    icon: BookOpen,
    title: "Study the principle",
    description: "A concise, original review of the week's core concept.",
  },
  {
    icon: Search,
    title: "Examine current behavior",
    description: "An honest, reflective self-assessment — not a clinical test.",
  },
  {
    icon: ListChecks,
    title: "Choose five implementation actions",
    description: "Concrete, schedulable steps sized to your challenge level.",
  },
  {
    icon: CalendarCheck,
    title: "Track evidence",
    description: "Record what you actually did, with dates and outcomes.",
  },
  {
    icon: LineChart,
    title: "Review and improve",
    description: "A structured weekly review that feeds next week's priorities.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="border-border bg-surface-muted border-b">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
            Independent study and implementation program
          </p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight font-semibold md:text-5xl">
            Motivation starts the work. Systems finish it.
          </h1>
          <p className="text-slate max-w-2xl text-lg">
            A ten-week study and implementation program designed to turn personal-development
            principles into scheduled actions, measurable behaviors, and lasting routines.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/program/new">Start My Program</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#modules">Preview the Ten Modules</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <h2 className="font-serif text-3xl font-semibold">What this program builds</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="text-accent h-6 w-6" aria-hidden="true" />
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate pt-0 text-sm">{description}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-border bg-surface-muted border-y py-16 md:py-24">
        <div className="container-page">
          <h2 className="font-serif text-3xl font-semibold">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-5">
            {howItWorks.map(({ icon: Icon, title, description }, index) => (
              <li key={title} className="border-border bg-surface rounded-lg border p-5">
                <div className="text-slate-muted flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                  <span>Step {index + 1}</span>
                </div>
                <Icon className="text-accent mt-3 h-5 w-5" aria-hidden="true" />
                <p className="mt-3 font-medium">{title}</p>
                <p className="text-slate mt-1 text-sm">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="modules" className="container-page py-16 md:py-24">
        <h2 className="font-serif text-3xl font-semibold">The ten-week program</h2>
        <p className="text-slate mt-2 max-w-2xl">
          One module per week. Each module includes a concept review, a self-assessment, five
          implementation actions, scheduling, tracking, structured reflection, and a weekly review.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROGRAM_MODULES.map((module) => (
            <Card key={module.slug}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <Badge variant="outline">Week {module.week}</Badge>
                  <CardTitle className="mt-2 text-lg">{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-slate pt-0 text-sm">{module.subtitle}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="border-border-strong bg-surface-muted text-slate rounded-lg border p-6 text-sm">
          {INDEPENDENT_STATUS_NOTICE}{" "}
          <Link href="/about" className="text-accent hover:underline">
            Read the full independence and sourcing notice.
          </Link>
        </div>
      </section>

      <section className="border-border bg-primary text-primary-foreground border-t py-16 md:py-24">
        <div className="container-page flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl font-serif text-3xl font-semibold md:text-4xl">
            Stop collecting motivation. Build a system that survives without it.
          </h2>
          <Button asChild size="lg" variant="accent">
            <Link href="/program/new">
              Begin Week One
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
