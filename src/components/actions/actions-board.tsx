"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import type { ImplementationAction } from "@/repositories/actions";
import { filterActionsByView, groupActionsByModule, type ActionView } from "@/services/action-views";
import { getModuleBySlug } from "@/content/modules";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createStandaloneActionAction,
  updateStandaloneActionAction,
} from "@/lib/actions/action-actions";
import type { ActionStatus } from "@/types/domain";

const VIEWS: { value: ActionView; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "overdue", label: "Overdue" },
  { value: "blocked", label: "Blocked" },
  { value: "completed", label: "Completed" },
  { value: "all", label: "All / by module" },
];

export function ActionsBoard({ programId, actions }: { programId: string; actions: ImplementationAction[] }) {
  const [view, setView] = useState<ActionView>("today");
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [nextPhysicalAction, setNextPhysicalAction] = useState("");
  const [dueDate, setDueDate] = useState("");

  const filtered = useMemo(() => filterActionsByView(actions, view), [actions, view]);
  const grouped = view === "all" ? groupActionsByModule(filtered) : null;

  function handleCreate() {
    if (!title.trim()) return;
    startTransition(async () => {
      await createStandaloneActionAction({
        programId,
        title,
        nextPhysicalAction: nextPhysicalAction || undefined,
        dueDate: dueDate || undefined,
        importance: "important",
        recurrence: "none",
        isDifficultAction: false,
      });
      setTitle("");
      setNextPhysicalAction("");
      setDueDate("");
    });
  }

  function setStatus(action: ImplementationAction, status: ActionStatus) {
    startTransition(async () => {
      await updateStandaloneActionAction(action.id, programId, { status });
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-sm font-medium">Add an action</p>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input
              placeholder="Next physical action (be specific)"
              value={nextPhysicalAction}
              onChange={(e) => setNextPhysicalAction(e.target.value)}
            />
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Button onClick={handleCreate} disabled={pending || !title.trim()}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as ActionView)}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {VIEWS.map((v) => (
            <TabsTrigger key={v.value} value={v.value}>{v.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={view}>
          {grouped ? (
            <div className="space-y-6">
              {Object.entries(grouped).map(([moduleSlug, moduleActions]) => (
                <div key={moduleSlug}>
                  <h3 className="font-serif text-lg font-semibold">
                    {moduleSlug === "unassigned" ? "Not tied to a module" : getModuleBySlug(moduleSlug)?.title ?? moduleSlug}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {moduleActions.map((action) => (
                      <ActionRow key={action.id} action={action} onStatusChange={(status) => setStatus(action, status)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate">Nothing here.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((action) => (
                <ActionRow key={action.id} action={action} onStatusChange={(status) => setStatus(action, status)} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ActionRow({ action, onStatusChange }: { action: ImplementationAction; onStatusChange: (status: ActionStatus) => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{action.title}</p>
          {action.nextPhysicalAction && <p className="text-sm text-slate">{action.nextPhysicalAction}</p>}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-muted">
            {action.dueDate && <span>{format(new Date(action.dueDate), "EEE, MMM d")}</span>}
            {action.moduleSlug && <Badge variant="outline">{getModuleBySlug(action.moduleSlug)?.title ?? action.moduleSlug}</Badge>}
            {action.isDifficultAction && <Badge variant="caution">Difficult action</Badge>}
          </div>
        </div>
        <Select value={action.status} onValueChange={(v) => onStatusChange(v as ActionStatus)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not started</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="abandoned-intentionally">Abandoned intentionally</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
