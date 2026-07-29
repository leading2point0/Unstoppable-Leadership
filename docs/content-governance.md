# Content governance

This document is the operating manual for the intellectual-property
safeguards described in the product spec. Read it before adding, editing,
or verifying any source or quotation.

## Independent status

Unstoppable Action Lab is an independent, unofficial educational study
guide. It is not affiliated with, authorized by, endorsed by, sponsored
by, or otherwise connected with Brian Tracy, Brian Tracy International,
G&D Media, or any related publisher, company, representative, or rights
holder. This notice (and the accompanying trademark, educational-use, and
legal-limitation notices) appears verbatim — sourced from a single
constant module, `src/content/disclaimers.ts` — on the landing page,
About page, footer, Sources page, and any exported document.

## What this application does and does not do

- It paraphrases personal-development concepts in original language.
- It does not reproduce chapter text or extended passages from any book.
- It does not include a downloadable copy of the book.
- It does not use the official book cover, Brian Tracy photographs, or
  Brian Tracy International branding.
- It does not claim to be an official or certified course.
- It does not generate quotations from memory, fabricate page numbers, or
  invent citations, research findings, statistics, or authors.

## The quote lifecycle

1. **Never seed quotations.** `scripts/seed.ts` seeds only the
   bibliographic record for the source book (title, author, publisher,
   ISBN, verification status) — never quotation text.
2. **Manual entry only.** An owner or administrator adds a quotation
   through `/admin/sources` (`src/components/sources/admin-source-manager.tsx`),
   typing it in from a lawfully obtained copy. The application has no code
   path that generates quotation text.
3. **`verifiedByOwner` starts `false`.** Every new quote record
   (`quote_records` table) is inserted unverified. `updated`/`verified`
   fields are never set to `true` at creation.
4. **Public display is enforced at the query layer, not the UI.**
   `listPublicQuotes()` (`src/repositories/sources.ts`) filters on
   `verifiedByOwner = true` in the SQL `WHERE` clause. There is no code
   path — public page, export, or API — that reads quotes without going
   through a verified-only query, so a UI bug can't accidentally leak an
   unverified quote onto a public page.
5. **Only the owner can verify.** `verifyQuoteAction` in
   `src/lib/actions/admin-source-actions.ts` calls `requireRole("owner")`
   — an administrator can add a quote, but cannot mark it verified.
   Verification stamps `verificationDate` and `verifiedById` for
   auditability.
6. **The admin warning.** Any quote with `verifiedByOwner: false` is shown
   in the admin screen with: _"Citation incomplete. Verify this quotation
   against a lawful copy before publication."_ This is the
   `UNVERIFIED_QUOTE_ADMIN_WARNING` constant in `src/content/disclaimers.ts`.
7. **Every quote requires commentary and educational purpose.** The Zod
   schema (`src/schemas/source.ts`) rejects a quote submission that
   doesn't include original commentary connecting it to an exercise or
   lesson, and a stated educational purpose — a bare quotation is not a
   valid record.

## Sources

- `source_records` mirrors the `SourceRecord` type from the spec:
  title, author/organization, publication details, source type, URL,
  ISBN/DOI, edition, publisher, pages used, verification status.
- New sources default to `verified: false` and `isPublic: true`; an
  admin explicitly verifies them before they're trustworthy, and can hide
  (`isPublic: false`) or mark a source `isOutdated` without deleting it.
- The public Sources page (`/sources`) only ever queries
  `listPublicSources()`, which filters on `verified = true AND is_public =
true AND is_outdated = false`.

## Research citations (insights)

`src/content/modules/*.ts` includes an `insights` array per module. Every
insight in the shipped content uses only categories that don't assert an
external verified fact without a real citation attached: `book-concept`,
`leadership`, `example`, `caution`, `counterpoint`. **No module ships with
a `research` or `quote` category insight**, because doing so would require
a real, verified source — and inventing one is exactly what this document
forbids. If a real, checked research citation is added later, attach it
through the `insights` / `insight_source_links` tables (or extend a
module's content file) with a genuine `sourceId`, and use the `research`
category only then.

## Adding or editing a source (step by step)

1. Sign in as an owner or administrator.
2. Go to `/admin/sources`.
3. Fill in the "Add a source" form. Leave it unverified until you've
   checked the details against the actual lawfully obtained copy
   (physical book, purchased ebook, or official publisher page).
4. Click "Verify" once confirmed. Only then does it appear on `/sources`.
5. If a later print/edition changes pagination, add a new source record
   (or update the `edition`/`pagesUsed` fields) rather than silently
   reusing stale page numbers.

## Adding a quotation (step by step)

1. Type the quotation manually from the lawful copy — do not paste from
   an AI-generated summary, a third-party quote-aggregator site, or
   memory.
2. Fill in author, work title, publisher, edition, and page if available.
3. Write original commentary explaining why this quotation is included
   and what exercise or lesson it supports.
4. Submit — it is created unverified.
5. As the owner, review it against the lawful copy one more time, then
   click "Verify (owner)". It will now appear on `/sources`.

## Demo content

`docs/deployment-railway.md` and `README.md` both note: demo/fictional
program data must only exist in development, never seeded into
production, and must never include copyrighted quotations or an
unverified-then-silently-verified quote.
