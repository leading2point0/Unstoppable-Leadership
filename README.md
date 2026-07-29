# Unstoppable Action Lab

**An Independent Personal Development Study and Action Program**

> Unstoppable Action Lab is an independent and unofficial educational study guide. It is not affiliated with, authorized by, endorsed by, sponsored by, or otherwise connected with Brian Tracy, Brian Tracy International, G&D Media, or any related publisher, company, representative, or rights holder. See [`docs/content-governance.md`](docs/content-governance.md) for the full intellectual-property policy.

## Product purpose

A ten-week, self-directed study and implementation program that converts
personal-development principles into scheduled actions, measurable
behaviors, and lasting routines — for individual study, leadership
development, executive coaching, manager training, small-group
discussion, or employee development programs. Every module requires a
decision, not just reading: a concept review, a reflective
self-assessment, five implementation actions, scheduling, tracking,
structured reflection, and a weekly review, all feeding a ten-week
scorecard and a final, editable "Personal Operating System" document.

## Screenshots

_Add screenshots here once you have a deployed instance to capture — the
landing page, dashboard, a module workspace, and the scorecard are the
most representative views._

## Technology stack

- Next.js 16 (App Router, Server Actions), TypeScript strict mode
- Tailwind CSS v4, hand-built shadcn-style UI primitives on Radix
- PostgreSQL + Drizzle ORM (migrations committed to `drizzle/`)
- Auth.js v5 (Credentials provider, JWT sessions with DB-tracked
  revocation)
- Zod (validation at every data boundary), React Hook Form (complex
  forms), Zustand (installed for future client-only UI state; not yet
  needed by any current screen)
- Recharts (progress visualizations), date-fns
- Vitest (unit tests), Playwright (end-to-end tests)
- Docker, Railway, GitHub Actions

## Installation

```bash
git clone <your-repo-url>
cd unstoppable-action-lab
cp .env.example .env        # then fill in DATABASE_URL, AUTH_SECRET, etc.
docker compose up -d        # local Postgres 16 on :5432
npm ci
npm run db:migrate
npm run db:seed
```

## Development commands

```bash
npm run dev            # start the dev server (http://localhost:3000)
npm run lint            # ESLint
npm run typecheck       # tsc --noEmit
npm run test             # Vitest unit tests
npm run test:watch       # Vitest in watch mode
npm run test:e2e         # Playwright end-to-end tests (starts its own dev server)
npm run check            # format:check + lint + typecheck + test — run this before every PR
npm run db:studio        # Drizzle Studio against DATABASE_URL
```

## Production build

```bash
npm run build
npm run start            # node .next/standalone/server.js
```

Or via Docker:

```bash
docker build -t unstoppable-action-lab .
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e AUTH_SECRET=$(openssl rand -base64 32) \
  -e AUTH_TRUST_HOST=true \
  unstoppable-action-lab
```

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full picture:
PostgreSQL as the single source of truth, the repository/service/content
layering, the auth/session model, and what the offline service worker
does and doesn't cover. See [`docs/database.md`](docs/database.md) for
the schema and migration workflow.

## Local-data / offline explanation

PostgreSQL is authoritative for every account. A service worker
(`public/sw.js`) caches the app shell and previously visited pages so
they keep working when you lose connectivity — this is a **read-only**
cache, not an offline mutation queue. Actions, journal entries, habit
check-ins, and everything else require a live connection to save. See
"Synchronization / offline" in `docs/architecture.md` for the reasoning
and what a future bidirectional sync layer would need to add.

## Backup and restore

See [`docs/backup-and-recovery.md`](docs/backup-and-recovery.md):
Railway Postgres backups, manual `pg_dump`/`pg_restore`, the per-user
JSON export at `/settings` (`GET /api/export/me`), and recovery
verification steps.

## PWA instructions

The app ships a web manifest (`public/manifest.webmanifest`) and a
generated icon set (`public/icons/`). On a supported mobile browser,
"Add to Home Screen" installs it as a standalone app. In development,
the service worker only registers in production builds
(`src/components/layout/register-service-worker.tsx`) so `next dev`
hot-reloading isn't fighting a stale cache.

## Accessibility notes

- Full keyboard navigation; every interactive control is reachable and
  operable without a mouse.
- `InsightPopover` (`src/components/insights/insight-popover.tsx`) opens
  on hover, keyboard focus, and click/tap, and closes on Escape or blur —
  information is never hover-only.
- Visible focus rings (`:focus-visible` in `globals.css`), semantic
  headings, form labels via `<Label>`, ARIA live status text for
  transient states.
- `prefers-reduced-motion` is respected globally.
- Charts (`LeadMeasureChart`, `ScorecardChart`) include a visually-hidden
  text summary of their data for screen readers.
- Status is communicated with icon + text + color together, never color
  alone (see the module status badges and habit recovery messaging).

This has not been through a full external WCAG 2.2 AA audit — treat the
above as "designed and built with these principles," not "independently
certified."

## Intellectual-property safeguards

Read [`docs/content-governance.md`](docs/content-governance.md) in full
before touching anything under `src/content/` or the source/quote admin
screen. In short: module content paraphrases concepts in original
language; no chapter text, book cover, or Brian Tracy photography is
used; quotations are never generated by the application, are entered
manually from a lawfully obtained copy, start unverified, and are
enforced (at the database query layer, not just the UI) to never appear
publicly until an owner explicitly verifies them.

## Quote-verification process / source-management instructions

Covered in detail in `docs/content-governance.md`. Short version: add a
source or quote at `/admin/sources` (owner or administrator), leave it
unverified until checked against the real lawful source, then an
**owner** (not just an administrator) clicks "Verify."

## Deployment instructions

Full walkthrough in [`docs/deployment-railway.md`](docs/deployment-railway.md):
pushing to GitHub, creating the Railway project and Postgres service,
required environment variables, the `npm run db:migrate` pre-deploy
command, the `/api/health` health check, generating a domain, bootstrapping
the owner account, and adding a custom domain.

## Future Supabase integration plan

This build uses Drizzle directly against Railway Postgres, not Supabase.
If a future phase moves to Supabase:

1. Point `DATABASE_URL` at the Supabase connection string — the schema
   and Drizzle queries are standard PostgreSQL and should work unchanged.
2. Decide whether to keep Auth.js (works fine against any Postgres) or
   migrate to Supabase Auth — if migrating, the `users`/`accounts`/
   `sessions` tables would need a compatibility shim or a one-time data
   migration, and `src/lib/auth.ts` would need a new adapter.
3. If adopting Supabase Storage for evidence file uploads (currently
   disabled — see "Known limitations"), implement the `STORAGE_PROVIDER`
   branch referenced in `.env.example` and wire it into
   `src/repositories/actions.ts`'s evidence functions.
4. Row-Level Security: this app currently enforces ownership entirely in
   the repository layer (`assertProgramOwnership`). If Supabase RLS is
   adopted as a second enforcement layer, mirror the same ownership rules
   at the database level rather than replacing the application-level
   checks — defense in depth, not a swap.

## Known limitations

- **No bidirectional offline sync.** The service worker caches reads
  only; there is no local mutation queue, conflict detection, or
  "Saved / Saving / Offline / Changes pending / Synchronization failed /
  Conflict requires review" status system. See "Synchronization /
  offline" in `docs/architecture.md`.
- **File uploads are disabled.** Evidence entries accept text, an
  optional filename string, and notes — no object storage is wired up.
- **Email delivery is optional and unconfigured by default.** Without
  SMTP variables set, the forgot-password flow tells the user honestly
  that email isn't configured rather than pretending to send anything.
- **Facilitator/cohort features are schema-ready but not built.** The
  `organizations`, `cohorts`, `cohort_members`, and `program_enrollments`
  tables exist and the `facilitator` role is defined, but there is no UI
  yet for a facilitator to create a cohort, assign a program, or view
  participant progress with the sharing-level rules the spec describes.
  Journal privacy defaults (`private` sharing level) are enforced at the
  schema level regardless.
- **No independent WCAG 2.2 AA audit.** See "Accessibility notes" above.
- **PWA icons are procedurally generated placeholders**, not a
  professionally designed mark — replace `public/icons/*.png` before a
  real public launch if you want a bespoke visual identity.
- **Rate limiting is in-memory and single-instance.** See `SECURITY.md`.
- **Scorecard visualizations cover the weekly-score chart and a full
  per-week breakdown table**, not every chart type listed in the
  original spec (a dedicated habit-consistency chart and a
  self-assessment-trend chart are not separately duplicated on the
  scorecard page — that data is visible on the Habits page and within
  each module's Assess section instead).

## Recommended next development phase

1. Build the facilitator/cohort UI on top of the existing schema
   (assign a program to a cohort, view aggregate — not private — progress,
   respect `sharingLevel`).
2. Add the bidirectional offline sync layer described in the original
   spec, if offline _editing_ (not just offline reading) is a real
   requirement for your users.
3. Wire up object storage for evidence file uploads behind the existing
   `STORAGE_PROVIDER` environment variable.
4. Add a Redis-backed rate limiter if you scale to multiple Railway
   replicas.
5. Commission real photography/iconography and a professionally designed
   PWA icon set once the product's visual identity is finalized.
6. Run an independent WCAG 2.2 AA accessibility audit and address
   findings.

## License

See [`LICENSE`](LICENSE). The software structure and original exercises
may be reused by the project owner. Third-party books, quotations,
trademarks, images, articles, and research remain subject to their
respective rights, licenses, and usage restrictions.
