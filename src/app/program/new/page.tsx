import type { Metadata } from "next";
import { requireUser } from "@/lib/auth-guard";
import { ProgramOnboardingForm } from "@/components/forms/program-onboarding-form";

export const metadata: Metadata = { title: "Start your program" };

export default async function NewProgramPage() {
  await requireUser();

  return (
    <div className="container-page container-prose py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Ten-week program</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Set up your program</h1>
      <p className="mt-2 text-slate">
        A few questions to personalize the ten weeks ahead. You can change any of this later in Settings.
      </p>
      <div className="mt-8">
        <ProgramOnboardingForm />
      </div>
    </div>
  );
}
