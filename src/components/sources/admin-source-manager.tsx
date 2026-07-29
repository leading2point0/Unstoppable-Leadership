"use client";

import { useRef, useState, useTransition } from "react";
import { Download, Upload } from "lucide-react";
import type { QuoteRecordRow, SourceRecordRow } from "@/repositories/sources";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createQuoteAction,
  createSourceAction,
  deleteQuoteAction,
  deleteSourceAction,
  importSourcesAction,
  markSourceOutdatedAction,
  setSourcePublicAction,
  unverifyQuoteAction,
  verifyQuoteAction,
  verifySourceAction,
} from "@/lib/actions/admin-source-actions";
import { downloadTextFile } from "@/lib/journal-export";
import { UNVERIFIED_QUOTE_ADMIN_WARNING } from "@/content/disclaimers";
import type { UserRole } from "@/types/domain";

export function AdminSourceManager({
  sources,
  quotes,
  role,
}: {
  sources: SourceRecordRow[];
  quotes: QuoteRecordRow[];
  role: UserRole;
}) {
  const isOwner = role === "owner";
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sourceForm, setSourceForm] = useState({
    title: "",
    authorOrOrganization: "",
    sourceType: "book" as const,
    publisher: "",
    isbn: "",
    url: "",
  });
  const [quoteForm, setQuoteForm] = useState({
    text: "",
    author: "",
    workTitle: "",
    page: "",
    commentary: "",
    educationalPurpose: "",
  });

  function submitSource() {
    if (!sourceForm.title || !sourceForm.authorOrOrganization) return;
    startTransition(async () => {
      await createSourceAction({ ...sourceForm, pagesUsed: [] });
      setSourceForm({
        title: "",
        authorOrOrganization: "",
        sourceType: "book",
        publisher: "",
        isbn: "",
        url: "",
      });
    });
  }

  function submitQuote() {
    if (
      !quoteForm.text ||
      !quoteForm.author ||
      !quoteForm.workTitle ||
      !quoteForm.commentary ||
      !quoteForm.educationalPurpose
    )
      return;
    startTransition(async () => {
      await createQuoteAction(quoteForm);
      setQuoteForm({
        text: "",
        author: "",
        workTitle: "",
        page: "",
        commentary: "",
        educationalPurpose: "",
      });
    });
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      try {
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed) ? parsed : parsed.sources;
        startTransition(async () => {
          await importSourcesAction(list);
        });
      } catch {
        alert("Could not parse that file as JSON.");
      }
    });
    e.target.value = "";
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            downloadTextFile(
              "sources-export.json",
              JSON.stringify(sources, null, 2),
              "application/json",
            )
          }
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Export sources JSON
        </Button>
        {isOwner && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportFile}
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" aria-hidden="true" /> Import sources JSON
            </Button>
          </>
        )}
      </div>

      <section>
        <h2 className="font-serif text-2xl font-semibold">Sources</h2>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Add a source</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Title"
              value={sourceForm.title}
              onChange={(e) => setSourceForm({ ...sourceForm, title: e.target.value })}
            />
            <Input
              placeholder="Author or organization"
              value={sourceForm.authorOrOrganization}
              onChange={(e) =>
                setSourceForm({ ...sourceForm, authorOrOrganization: e.target.value })
              }
            />
            <Select
              value={sourceForm.sourceType}
              onValueChange={(v) =>
                setSourceForm({ ...sourceForm, sourceType: v as typeof sourceForm.sourceType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "book",
                  "journal",
                  "government",
                  "official-website",
                  "article",
                  "video",
                  "other",
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Publisher"
              value={sourceForm.publisher}
              onChange={(e) => setSourceForm({ ...sourceForm, publisher: e.target.value })}
            />
            <Input
              placeholder="ISBN"
              value={sourceForm.isbn}
              onChange={(e) => setSourceForm({ ...sourceForm, isbn: e.target.value })}
            />
            <Input
              placeholder="URL"
              value={sourceForm.url}
              onChange={(e) => setSourceForm({ ...sourceForm, url: e.target.value })}
            />
            <Button onClick={submitSource} disabled={pending} className="w-fit sm:col-span-2">
              Add source
            </Button>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-2">
          {sources.map((source) => (
            <Card key={source.id}>
              <CardContent className="flex flex-col gap-2 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{source.title}</p>
                  <p className="text-slate text-sm">{source.authorOrOrganization}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant={source.verified ? "success" : "caution"}>
                      {source.verified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge variant={source.isPublic ? "outline" : "neutral"}>
                      {source.isPublic ? "Public" : "Hidden"}
                    </Badge>
                    {source.isOutdated && <Badge variant="caution">Outdated</Badge>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!source.verified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        startTransition(async () => {
                          await verifySourceAction(source.id);
                        })
                      }
                    >
                      Verify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      startTransition(async () => {
                        await setSourcePublicAction(source.id, !source.isPublic);
                      })
                    }
                  >
                    {source.isPublic ? "Hide" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      startTransition(async () => {
                        await markSourceOutdatedAction(source.id, !source.isOutdated);
                      })
                    }
                  >
                    {source.isOutdated ? "Mark current" : "Mark outdated"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      startTransition(async () => {
                        await deleteSourceAction(source.id);
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-semibold">Quotations</h2>
        <p className="text-slate mt-1 text-sm">
          Only the owner can verify a quotation. Unverified quotations are never shown on the public
          Sources page.
        </p>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Add a quotation</CardTitle>
            <CardDescription>
              Enter text manually from a lawfully obtained copy — never generated automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              placeholder="Quote text"
              rows={2}
              value={quoteForm.text}
              onChange={(e) => setQuoteForm({ ...quoteForm, text: e.target.value })}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="Author"
                value={quoteForm.author}
                onChange={(e) => setQuoteForm({ ...quoteForm, author: e.target.value })}
              />
              <Input
                placeholder="Work title"
                value={quoteForm.workTitle}
                onChange={(e) => setQuoteForm({ ...quoteForm, workTitle: e.target.value })}
              />
              <Input
                placeholder="Page"
                value={quoteForm.page}
                onChange={(e) => setQuoteForm({ ...quoteForm, page: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Original commentary connecting this quote to an exercise or lesson"
              rows={2}
              value={quoteForm.commentary}
              onChange={(e) => setQuoteForm({ ...quoteForm, commentary: e.target.value })}
            />
            <Input
              placeholder="Educational purpose"
              value={quoteForm.educationalPurpose}
              onChange={(e) => setQuoteForm({ ...quoteForm, educationalPurpose: e.target.value })}
            />
            <Button onClick={submitQuote} disabled={pending}>
              Add quotation (unverified)
            </Button>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-2">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="space-y-2 pt-6">
                <p className="italic">&ldquo;{quote.text}&rdquo;</p>
                <p className="text-slate text-sm">
                  — {quote.author}, {quote.workTitle}
                  {quote.page ? `, p. ${quote.page}` : ""}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={quote.verifiedByOwner ? "success" : "caution"}>
                    {quote.verifiedByOwner ? "Verified — public" : "Unverified — hidden"}
                  </Badge>
                  {!quote.verifiedByOwner && (
                    <p className="text-caution text-xs">{UNVERIFIED_QUOTE_ADMIN_WARNING}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {isOwner && !quote.verifiedByOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        startTransition(async () => {
                          await verifyQuoteAction(quote.id);
                        })
                      }
                    >
                      Verify (owner)
                    </Button>
                  )}
                  {isOwner && quote.verifiedByOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        startTransition(async () => {
                          await unverifyQuoteAction(quote.id);
                        })
                      }
                    >
                      Unverify
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      startTransition(async () => {
                        await deleteQuoteAction(quote.id);
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
