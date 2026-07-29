"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { JournalEntry } from "@/repositories/journal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Download } from "lucide-react";
import {
  downloadTextFile,
  journalEntriesToHtml,
  journalEntriesToMarkdown,
} from "@/lib/journal-export";

export function JournalList({ entries }: { entries: JournalEntry[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.toLowerCase();
    return entries.filter((e) =>
      [e.wins, e.resistance, e.lessons, e.decisions, e.followUpAction, e.body, ...(e.tags ?? [])]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search journal entries…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadTextFile(
                "journal-export.md",
                journalEntriesToMarkdown(filtered),
                "text/markdown",
              )
            }
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadTextFile("journal-export.html", journalEntriesToHtml(filtered), "text/html")
            }
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Printable HTML
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate py-8 text-center text-sm">No entries yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {format(new Date(entry.entryDate), "EEEE, MMMM d")}
                  </p>
                  <div className="flex items-center gap-2">
                    {entry.mode === "ruthless-review" && (
                      <Badge variant="caution">Ruthless Review</Badge>
                    )}
                    <span className="text-slate-muted flex items-center gap-1 text-xs">
                      <Lock className="h-3 w-3" aria-hidden="true" /> Private
                    </span>
                  </div>
                </div>
                <dl className="text-slate mt-2 space-y-1 text-sm">
                  {entry.wins && (
                    <p>
                      <strong className="text-foreground">Wins:</strong> {entry.wins}
                    </p>
                  )}
                  {entry.resistance && (
                    <p>
                      <strong className="text-foreground">Resistance:</strong> {entry.resistance}
                    </p>
                  )}
                  {entry.lessons && (
                    <p>
                      <strong className="text-foreground">Lessons:</strong> {entry.lessons}
                    </p>
                  )}
                  {entry.followUpAction && (
                    <p>
                      <strong className="text-foreground">Follow-up:</strong> {entry.followUpAction}
                    </p>
                  )}
                  {entry.body && <p className="whitespace-pre-line">{entry.body}</p>}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
