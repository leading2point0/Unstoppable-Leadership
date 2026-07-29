"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createProgramSchema, type CreateProgramInput } from "@/schemas/program";
import { createProgramAction } from "@/lib/actions/program-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CHALLENGE_LEVELS = [
  {
    value: "foundation",
    label: "Foundation",
    description: "Smaller actions, lighter weekly load. Good for a first attempt or a busy season.",
  },
  {
    value: "serious",
    label: "Serious",
    description: "The standard pace: five real actions and a full weekly review each week.",
  },
  {
    value: "intensive",
    label: "Intensive",
    description:
      "Larger actions and deeper reflection for someone ready to push hard for ten weeks.",
  },
] as const;

export function ProgramOnboardingForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProgramInput>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      usageType: "individual",
      startDate: new Date().toISOString().slice(0, 10),
      preferredReviewDay: 5,
      challengeLevel: "serious",
    },
  });

  const usageType = watch("usageType");
  const challengeLevel = watch("challengeLevel");
  const preferredReviewDay = watch("preferredReviewDay");

  async function onSubmit(data: CreateProgramInput) {
    setServerError(null);
    const result = await createProgramAction(data);
    if (!result.ok || !result.programId) {
      setServerError(result.message ?? "Something went wrong. Try again.");
      return;
    }
    router.push(`/program/${result.programId}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {serverError && (
        <p className="bg-critical-bg text-critical rounded-md px-3 py-2 text-sm" role="alert">
          {serverError}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About you</CardTitle>
          <CardDescription>
            This personalizes the program. Nothing here is shared publicly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Preferred name</Label>
            <Input
              id="displayName"
              {...register("displayName")}
              aria-invalid={Boolean(errors.displayName)}
            />
            {errors.displayName && (
              <p className="text-critical text-sm">{errors.displayName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="primaryReason">Primary reason for using this program</Label>
            <Textarea id="primaryReason" {...register("primaryReason")} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>How will you use this?</Label>
            <Select
              value={usageType}
              onValueChange={(v) => setValue("usageType", v as CreateProgramInput["usageType"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual use</SelectItem>
                <SelectItem value="leadership-team">Leadership team use</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pacing</CardTitle>
          <CardDescription>
            When you&apos;ll start and how you&apos;ll review each week.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
                aria-invalid={Boolean(errors.startDate)}
              />
              {errors.startDate && (
                <p className="text-critical text-sm">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminderTime">Preferred reminder time</Label>
              <Input id="reminderTime" type="time" {...register("reminderTime")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preferred weekly review day</Label>
            <Select
              value={String(preferredReviewDay)}
              onValueChange={(v) => setValue("preferredReviewDay", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKDAYS.map((day, index) => (
                  <SelectItem key={day} value={String(index)}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Focus</CardTitle>
          <CardDescription>What you&apos;re working toward right now.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryLifeArea">Primary life area</Label>
            <Input
              id="primaryLifeArea"
              placeholder="e.g. Career, Health, Leadership, Family"
              {...register("primaryLifeArea")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentGoal">Current major goal</Label>
            <Textarea id="currentGoal" rows={3} {...register("currentGoal")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Challenge level</CardTitle>
          <CardDescription>
            This changes how large your actions are and how deep the reflection goes — not the
            underlying content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {CHALLENGE_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setValue("challengeLevel", level.value)}
                aria-pressed={challengeLevel === level.value}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  challengeLevel === level.value
                    ? "border-accent bg-surface-muted"
                    : "border-border hover:bg-surface-muted"
                }`}
              >
                <p className="font-medium">{level.label}</p>
                <p className="text-slate mt-1 text-xs">{level.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Setting up your program…" : "Start My Program"}
      </Button>
    </form>
  );
}
