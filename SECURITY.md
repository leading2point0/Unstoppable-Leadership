# Security

## Reporting a vulnerability

If you find a security issue in this repository, please report it
privately to the project owner rather than opening a public issue.
Include steps to reproduce and the potential impact. Do not test against
the production deployment with anything destructive (account takeover
attempts, data exfiltration, etc.) without prior written authorization.

## Baseline protections in this build

- Passwords hashed with bcrypt (cost factor 12), never logged.
- Login lockout after repeated failures, plus in-memory rate limiting on
  login and password-reset requests (`src/lib/rate-limit.ts`).
- JWT sessions with a server-tracked `sessions` table for real revocation
  (see `docs/architecture.md`).
- CSRF: Next.js Server Actions verify the request's `Origin` header
  against the deployment's allowed origins by default; no additional
  hand-rolled CSRF token system was layered on top.
- Content-Security-Policy with a per-request nonce
  (`src/proxy.ts`), plus `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive
  `Permissions-Policy`.
- Every server action and route handler re-verifies authentication,
  role, and resource ownership server-side — the UI hiding a button is
  never the only protection.
- Audit log (`audit_events`) for authentication and administrative
  events, excluding secrets and full journal text.
- Zod validation at every data-entry boundary (forms, server actions).
- Owner bootstrap is opt-in via environment variables, refuses weak
  passwords, and is a no-op once an owner exists (`scripts/bootstrap-owner.ts`)
  — there is no hard-coded default account.

## Known limitations (be aware of these before relying on this in production)

- **Rate limiting is in-memory and per-instance.** If you scale the web
  service to multiple Railway replicas, the limiter's state doesn't share
  across them, meaningfully weakening it. See `docs/architecture.md` →
  "Optional future services" for the Redis upgrade path.
- **File uploads are disabled.** Evidence entries accept text, an
  optional filename string, and notes — no binary file storage is wired
  up, so there's no file-upload attack surface to secure yet. Wire up
  object storage deliberately (with content-type validation, size limits,
  and randomized keys) before enabling uploads.
- **No automated penetration testing has been run against this build.**
  Treat the above as "what's in place," not "independently verified
  secure."

## Dependency audit status

`npm audit --audit-level=high` currently reports findings in:

- `eslint`'s transitive `minimatch`/`brace-expansion` chain (devDependency
  only — not present in the production runtime bundle)
- `drizzle-kit`'s transitive `esbuild` (used only to load
  `drizzle.config.ts`, not to run an exposed dev server)
- `postcss` and `sharp` bundled *inside* `next`'s own `node_modules`
  (Next.js's internal copies, not ones this project can independently
  upgrade — track for resolution in a future Next.js patch release)

These are visible (not suppressed) in `.github/workflows/security.yml`
but do not hard-fail CI, since none are reachable from the shipped
application. Re-run `npm audit` after every dependency bump and revisit
this list — don't assume it stays accurate.
