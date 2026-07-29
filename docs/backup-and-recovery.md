# Backup and recovery

PostgreSQL is the single source of truth. The application-level JSON
exports described below are useful for a user who wants a personal copy
of their data, or for migrating a specific account — **they are not a
substitute for a real PostgreSQL backup**, and recovering the whole
service from application-level exports would be slow, lossy (no exact
timestamps/relations guaranteed to reconstruct perfectly), and would
require rebuilding every account by hand.

## Railway PostgreSQL backups

Railway's managed Postgres offers point-in-time / periodic backups
depending on your plan. In the Railway dashboard:

1. Open the Postgres service.
2. Go to the **Backups** tab.
3. Confirm a backup schedule is enabled and note the retention window.
4. Periodically use **Restore** (to a _new_ service, not in place) to
   confirm backups are actually restorable — an untested backup is not a
   backup.

Because Railway's backup UI and retention options change over time,
treat the dashboard as the source of truth for exact steps, and record
your organization's chosen backup frequency and retention in your own
runbook.

## Manual logical backup (pg_dump)

For an out-of-band backup independent of Railway's own system:

```bash
# From a machine with the DATABASE_URL for the production database
pg_dump "$DATABASE_URL" --format=custom --file=unstoppable-$(date +%Y%m%d).dump
```

Store the resulting file somewhere with its own access controls and
retention policy (it contains all user data, including private journal
entries) — not in this git repository, and not in an unencrypted shared
drive.

## Restore procedure

```bash
# Into a fresh, empty database — never restore over a live production
# database without a very good reason and a second, separate backup of
# the current state first.
pg_restore --clean --if-exists --no-owner --dbname="$TARGET_DATABASE_URL" unstoppable-YYYYMMDD.dump
```

After restoring:

1. Run `npm run verify:env` against the target environment.
2. Sign in as the owner account and confirm program data is present.
3. Hit `/api/readiness` and confirm it returns 200.
4. Spot-check that private journal entries are still marked private
   (`sharing_level = 'private'`) and are not visible to a facilitator
   test account.

## User-level export

Any signed-in user can download their own data at `/settings` → "Download
my data" (`GET /api/export/me`). This includes their programs, module
progress, actions and evidence, habits, journal entries, weekly reviews,
scorecards, and operating system — **it never includes their password
hash, session tokens, or password-reset tokens** (see
`src/repositories/user-export.ts`).

## Owner-level export

There is no single "export everything" button in this build — an owner
needing a full data export should use `pg_dump` (above), which is both
more complete and doesn't require holding the entire database in
application memory. The admin source/quote screen does support exporting
the source and quote library as JSON independently
(`/admin/sources` → "Export sources JSON").

## Recovery objectives (recommended starting point)

These are suggested starting values — set them deliberately for your
deployment based on how much data loss and downtime your users would
tolerate, and record the actual chosen values in your own runbook:

- **Recovery Point Objective (RPO):** how much recent data you're willing
  to lose (e.g., 24 hours if backups run daily). More frequent backups
  lower this at the cost of storage and backup-window overhead.
- **Recovery Time Objective (RTO):** how long a restore is allowed to
  take before it materially affects users. A `pg_restore` of a database
  this shape should be measured in minutes, not hours, but verify this
  against your actual data volume periodically.

## What is not backed up automatically

- Anything a user only entered into the offline-cached view of a page
  before regaining connectivity and saving — the service worker caches
  _reads_, not unsynced writes (see "Synchronization / offline" in
  `docs/architecture.md`).
- Audit log entries older than your chosen Postgres backup retention
  window.
