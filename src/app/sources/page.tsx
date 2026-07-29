import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Quote } from "lucide-react";
import { listPublicQuotes, listPublicSources } from "@/repositories/sources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALL_IP_NOTICES } from "@/content/disclaimers";
import { getAuthenticatedUser } from "@/lib/auth-guard";
import { roleAtLeast } from "@/types/domain";

export const metadata: Metadata = { title: "Sources & Attribution" };

export default async function SourcesPage() {
  const [sources, quotes, user] = await Promise.all([
    listPublicSources(),
    listPublicQuotes(),
    getAuthenticatedUser(),
  ]);

  return (
    <div className="container-page py-16">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">
        Sources &amp; Attribution
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">
        Where this program&apos;s ideas and citations come from
      </h1>
      <p className="text-slate mt-4 max-w-2xl">
        Every source below has been manually verified by the site owner. Quotations are shown only
        after separate, explicit verification against a lawfully obtained copy — unverified
        quotations are never displayed here.
      </p>

      {user && roleAtLeast(user.role, "admin") && (
        <Link
          href="/admin/sources"
          className="text-accent mt-4 inline-block text-sm hover:underline"
        >
          Open the source &amp; quote administration screen →
        </Link>
      )}

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold">
          <BookOpen className="text-accent h-5 w-5" aria-hidden="true" /> Verified sources
        </h2>
        {sources.length === 0 ? (
          <p className="text-slate mt-4 text-sm">No sources have been published yet.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {sources.map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <Badge variant="outline" className="w-fit capitalize">
                    {source.sourceType.replace("-", " ")}
                  </Badge>
                  <CardTitle className="mt-2 text-base">{source.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-slate space-y-1 pt-0 text-sm">
                  <p>{source.authorOrOrganization}</p>
                  {source.publisher && <p>{source.publisher}</p>}
                  {source.isbn && <p>ISBN {source.isbn}</p>}
                  {source.edition && <p className="text-slate-muted text-xs">{source.edition}</p>}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      View source
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold">
          <Quote className="text-accent h-5 w-5" aria-hidden="true" /> Verified quotations
        </h2>
        {quotes.length === 0 ? (
          <p className="text-slate mt-4 text-sm">
            No direct quotations have been published yet. This program paraphrases concepts by
            default.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {quotes.map((quote) => (
              <blockquote
                key={quote.id}
                className="border-border bg-surface-muted rounded-lg border p-5"
              >
                <p className="italic">&ldquo;{quote.text}&rdquo;</p>
                <footer className="text-slate mt-2 text-sm">
                  — {quote.author}, <cite>{quote.workTitle}</cite>
                  {quote.page ? `, p. ${quote.page}` : ""}
                </footer>
                <p className="text-slate mt-3 text-sm">{quote.commentary}</p>
              </blockquote>
            ))}
          </div>
        )}
      </section>

      <section className="border-border-strong bg-surface-muted text-slate-muted mt-10 space-y-2 rounded-lg border p-6 text-xs leading-relaxed">
        {ALL_IP_NOTICES.map((notice) => (
          <p key={notice}>{notice}</p>
        ))}
      </section>
    </div>
  );
}
