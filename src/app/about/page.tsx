import type { Metadata } from "next";
import { ALL_IP_NOTICES, INDEPENDENT_STATUS_NOTICE } from "@/content/disclaimers";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-page container-prose py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">What Unstoppable Action Lab is</h1>

      <div className="prose-content mt-6 space-y-4 text-slate">
        <p>
          Unstoppable Action Lab is a ten-week, self-directed study and implementation program. It is inspired by
          personal-development themes commonly associated with motivation, personal responsibility, goal execution,
          resilience, and habit formation — the same territory covered by many books and courses in this field,
          including <em>Unstoppable: Motivation Secrets You Need to Develop Courage, Confidence and a Positive Mental
          Attitude</em> by Brian Tracy.
        </p>
        <p>
          This program does not summarize or reproduce that book. Every concept review, self-assessment, exercise,
          and reflection prompt in this application is original material written for this program. Where the
          application cites outside research, each citation is manually verified against a real source before
          publication — see the <a href="/sources" className="text-accent hover:underline">Sources &amp; Attribution</a> page.
        </p>
        <p>{INDEPENDENT_STATUS_NOTICE}</p>
      </div>

      <h2 className="mt-10 font-serif text-2xl font-semibold">Notices</h2>
      <div className="mt-4 space-y-4 rounded-lg border border-border bg-surface-muted p-6 text-sm leading-relaxed text-slate">
        {ALL_IP_NOTICES.map((notice) => (
          <p key={notice}>{notice}</p>
        ))}
      </div>

      <h2 className="mt-10 font-serif text-2xl font-semibold">How this program was built</h2>
      <div className="mt-4 space-y-4 text-slate">
        <p>
          Concept reviews paraphrase widely discussed personal-development and behavioral-science ideas in original
          language. Direct quotations are never generated automatically — any quotation from a copyrighted work is
          entered and verified manually by the site owner against a lawfully obtained copy before it can appear
          anywhere on the public site. Unverified quotations are blocked from public display; see the Sources page
          for details on that process.
        </p>
      </div>
    </div>
  );
}
