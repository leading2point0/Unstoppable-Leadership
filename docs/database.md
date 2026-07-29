# Database

PostgreSQL is the authoritative store for every piece of application
data. This document covers the schema conventions, migration workflow,
and the JSONB exceptions to "normalize everything."

## Conventions

- **IDs**: application-generated UUIDv4 (`crypto.randomUUID()` via
  `$defaultFn` in `src/db/schema/helpers.ts`), not `gen_random_uuid()`.
  This avoids depending on the `pgcrypto` extension being enabled on a
  fresh Railway Postgres instance.
- **Timestamps**: `created_at` / `updated_at` on every table via the
  shared `timestamps` helper; `updated_at` auto-updates via Drizzle's
  `$onUpdate`.
- **Ownership**: every user-owned table carries (directly or through a
  foreign key chain) a path back to `users.id` — most directly through
  `programs.owner_id`. The repository layer never trusts a caller-supplied
  ID without checking that chain (`assertProgramOwnership` in
  `src/repositories/authorization.ts`).
- **Cascades**: child records (module progress, actions, habits, journal
  entries, etc.) cascade-delete when their program is deleted, and a
  program cascade-deletes when its owning user is deleted — account
  deletion is meant to actually remove the data, not orphan it.
- **Enums**: Postgres enums (`src/db/schema/enums.ts`) back the
  TypeScript union types in `src/types/domain.ts`, so the database
  rejects an invalid status/role/category at the constraint level, not
  only in application code.

## Why JSONB in a few places

Per the "normalize by default" rule, JSONB is used only where the spec
explicitly calls for flexible or versioned content:

- `operating_systems.primary_goal`, `.big_three`,
  `.daily_non_negotiables`, `.leadership_commitments`,
  `.habit_architecture` — the final document is meant to be freely
  editable and doesn't need to be queried column-by-column; it's read and
  written as a whole document.
- `audit_events.details` — administrative event metadata varies by event
  type (a source verification event and a login-lockout event don't share
  a shape).

Everything else — actions, habits, journal entries, assessments, lead
measures, weekly reviews, scorecards — is normalized columns, because
those are actually queried, filtered, and aggregated (e.g., "actions due
today," "this week's scorecard total").

## Migrations

Migrations are generated with `drizzle-kit` and committed to `drizzle/`.

```bash
npm run db:generate   # after changing src/db/schema/*.ts, generates a new SQL migration
npm run db:migrate    # applies pending migrations to DATABASE_URL
npm run db:studio     # opens Drizzle Studio against DATABASE_URL
```

Railway runs `npm run db:migrate` as the pre-deploy command (configured
in the dashboard — see `docs/deployment-railway.md`) before routing
traffic to the new container. **A failed migration fails the deploy**;
Railway keeps the previous container serving traffic until a deploy
succeeds.

Never hand-edit a committed migration file after it has shipped to any
shared environment (staging or production) — generate a new migration
instead, even to fix a mistake in an earlier one.

## Seeding

`npm run db:seed` (`scripts/seed.ts`) seeds:

- the module registry (slug/week/title/content version, mirroring
  `src/content/modules`)
- the single verified bibliographic record for the source book (title,
  author, publisher, ISBN — no chapter text, no quotations)

It never seeds quotations, demo user accounts, or demo journal entries in
a way that would ship to production — see `docs/content-governance.md`.

## Local development database

```bash
docker compose up -d      # starts Postgres 16 on localhost:5432
cp .env.example .env
npm run db:migrate
npm run db:seed
```

`docker-compose.yml` is for local development only; it is not used in
the Railway deployment (Railway provisions its own managed Postgres
service).
