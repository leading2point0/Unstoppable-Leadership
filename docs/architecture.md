# Architecture

## Overview

Unstoppable Action Lab is a Next.js 16 App Router application written in
strict TypeScript. PostgreSQL (via Drizzle ORM) is the single source of
truth for all persistent data — user accounts, programs, module progress,
journal entries, actions, habits, weekly reviews, scorecards, the final
operating system, and the source/quote library. There is no local-only
mode in production: every account requires authentication, and every
mutation goes through a server action or route handler that re-verifies
authentication, authorization, resource ownership, and input validity.

```
Browser
  │  (HTTPS, CSP with per-request nonce)
  ▼
Next.js App Router (server components + server actions + route handlers)
  │
  ├─ Auth.js (Credentials provider, JWT session + DB-tracked revocation)
  ├─ Repository layer (src/repositories) — the only code that talks to Drizzle
  ├─ Service layer (src/services) — pure calculation functions (scoring,
  │  streaks, progress, assessment gaps), unit-tested in isolation
  └─ Content layer (src/content) — module copy, disclaimers, versioned
     independently of the database schema
  │
  ▼
PostgreSQL (Railway-managed, or docker-compose locally)
```

A service worker (`public/sw.js`) caches the app shell and static assets
so previously visited pages keep working offline; it is a **read-only**
cache, not a bidirectional sync engine. See "Known limitations" in the
README for what that does and doesn't cover.

## Why this stack

- **Next.js App Router + Server Actions** — lets the UI call
  ownership-checked mutations directly without hand-rolling a separate
  REST/GraphQL layer, while still exposing a couple of plain route
  handlers (`/api/health`, `/api/readiness`, `/api/export/me`,
  `/api/auth/*`) where a conventional HTTP endpoint is the right shape.
- **Drizzle ORM** — SQL-shaped, fully typed schema and queries, with
  migrations committed to the repo (`drizzle/`) rather than generated at
  deploy time from a live-introspected schema.
- **Auth.js v5, Credentials provider, JWT sessions** — the Credentials
  provider does not support Auth.js's database session strategy, so
  sessions are JWT-based; a parallel `sessions` table
  (`src/db/schema/auth.ts`) is written on every sign-in and checked on
  every `requireUser()` call, so revoking a session (password reset,
  account deletion, "admin force sign-out") actually takes effect on the
  next request instead of waiting for the JWT to expire.

## Directory structure

```
src/
  app/            Routes (pages, layouts, route handlers, server actions colocated in lib/actions)
  components/      ui/ (primitives), layout/, forms/, modules/, actions/, habits/, journal/, sources/, charts/, insights/, progress/
  content/        modules/ (10 module definitions), research/, disclaimers.ts
  db/             Drizzle schema (schema/) and the pooled client (index.ts)
  hooks/          (reserved for future client hooks)
  lib/            env, auth, password hashing, rate limiting, audit log, ICS/export helpers, actions/ (server actions)
  repositories/   Ownership-checked data access — the only layer that imports `db`
  schemas/        Zod input schemas, one per domain
  services/       Pure, unit-tested calculation functions
  stores/         (reserved for client-only UI state via Zustand, if/when needed)
  types/          Shared domain types
  utils/          (reserved; `lib/utils.ts` currently holds the `cn()` helper)
```

## Data model

32 tables, grouped by concern in `src/db/schema/`:

- `auth.ts` — users, accounts (OAuth-shaped for future providers),
  sessions, verification/password-reset tokens
- `orgs.ts` — organizations, organization members, cohorts, cohort members
- `programs.ts` — programs (a participant's ten-week run), program
  enrollments, the module registry, module progress
- `assessments.ts` — self-assessment snapshots and per-question responses
- `actions.ts` — implementation actions and their evidence
- `measures.ts` — lead measures and their daily/weekly entries
- `habits.ts` — habits and per-day habit entries
- `journal.ts` — journal entries (private by default, with a sharing level)
- `reviews.ts` — weekly reviews, scorecards, the operating system document
- `sources.ts` — source records, quote records, insights, insight/source links
- `system.ts` — user preferences, audit events, export records

See `docs/database.md` for the full rationale, including why some fields
use JSONB (versioned/flexible content) instead of normalized columns.

## Content versioning

Module *content* (the ten weeks' text, assessment questions, and
implementation steps) lives in code (`src/content/modules`), not the
database — it's reviewed and deployed like any other code change. The
`modules` table only stores a lightweight registry (slug, week, title,
content version) so a participant's `moduleProgress` row can record which
content version they completed against. If module copy changes after a
participant has completed a module, their historical answers are
untouched; only future starts see the new version.

## Synchronization / offline

The production architecture in this build does **not** include the full
bidirectional sync engine described in the original spec (local mutation
queue, conflict detection, per-record "Saved / Saving / Offline / Changes
pending / Synchronization failed / Conflict requires review" status).
PostgreSQL is the only place mutations are durably written; the service
worker only caches already-rendered pages for offline *reading*. Building
a correct, tested offline-write-with-conflict-resolution layer is a
substantial project in its own right — see "Recommended next phase" in
the README.

## Security posture

- CSP with a per-request nonce, generated in `src/proxy.ts` (Next.js 16's
  successor to `middleware.ts`) and threaded through to the root layout.
- Secure headers: `X-Frame-Options: DENY`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a
  restrictive `Permissions-Policy`.
- Every server action re-derives the authenticated user via
  `requireUser()`/`requireRole()` — the UI never assumes a hidden button
  is sufficient protection.
- In-memory rate limiting on login and password-reset requests
  (`src/lib/rate-limit.ts`), documented as single-instance-only; see
  "Optional future services" below for the Redis upgrade path.
- Audit log (`audit_events`) for authentication and administrative
  actions, without ever logging secrets or full journal text.

## Optional future services (not provisioned by default)

- **Redis** — for rate limiting across multiple Railway replicas, or for
  a job queue.
- **Object storage (S3-compatible / Railway volumes)** — for evidence file
  uploads, currently disabled; only text evidence and metadata are stored.
- **Worker service** — for scheduled email reminders and weekly-review
  nudges.
- **Cron service** — for maintenance tasks (token cleanup, scheduled
  exports).
