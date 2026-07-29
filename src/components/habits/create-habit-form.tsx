"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createHabitAction } from "@/lib/actions/habit-actions";

export function CreateHabitForm({ programId }: { programId: string }) {
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [minimumVersion, setMinimumVersion] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    startTransition(async () => {
      await createHabitAction({
        programId,
        name,
        trigger: trigger || undefined,
        minimumVersion: minimumVersion || undefined,
        frequency: "daily",
        startDate: format(new Date(), "yyyy-MM-dd"),
      });
      setName("");
      setTrigger("");
      setMinimumVersion("");
    });
  }

  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <p className="text-sm font-medium">Add a habit</p>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <Input placeholder="Habit name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Trigger (what cues it)"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
          <Input
            placeholder="Minimum version (for bad days)"
            value={minimumVersion}
            onChange={(e) => setMinimumVersion(e.target.value)}
          />
          <Button onClick={handleCreate} disabled={pending || !name.trim()}>
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
