# Deploying to Railway

This walks through getting this repository from a local checkout to a
running Railway deployment, end to end.

## 1. Push to GitHub

If you're starting from this checkout and haven't pushed it yet:

```bash
git init
git add .
git commit -m "Initial production release"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the actual repository you
created on GitHub — there is no default repository baked into this
project.

## 2. Create the Railway project

1. In the Railway dashboard, create a new project.
2. **Add a PostgreSQL service**: "New" → "Database" → "PostgreSQL".
3. **Add this repository as a service**: "New" → "GitHub Repo" → select
   your repository and branch (`main`).
4. Railway should detect the `Dockerfile` at the repository root and use
   it as the build source automatically (this repo's `railway.toml` also
   sets `builder = "DOCKERFILE"` explicitly).

## 3. Wire up environment variables

On the web service (not the Postgres service), go to **Variables** and
add a reference to the Postgres service's connection string plus the
application variables below. Railway lets you reference another service's
variable directly (`${{Postgres.DATABASE_URL}}` in the Railway UI) so the
value stays in sync if it ever changes.

Required:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Reference to the Postgres service's `DATABASE_URL` |
| `AUTH_SECRET` | A long random secret — `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | `true` |
| `APP_URL` | The Railway-generated domain (step 9), or your custom domain |
| `NODE_ENV` | `production` |
| `ALLOW_PUBLIC_REGISTRATION` | `false` until you've decided otherwise |
| `RATE_LIMIT_ENABLED` | `true` |

For the one-time owner bootstrap (remove after use — see step 12):

| Variable | Value |
| --- | --- |
| `BOOTSTRAP_OWNER_EMAIL` | Your email |
| `BOOTSTRAP_OWNER_PASSWORD` | A strong, temporary password (12+ chars, letters + a number/symbol) |
| `BOOTSTRAP_OWNER_NAME` | Your name |

Optional (email delivery for password resets — without these, the app
disables the pretense of sending reset emails and tells the user to
contact an administrator instead):

| Variable | Value |
| --- | --- |
| `EMAIL_FROM` | e.g. `no-reply@yourdomain.com` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_SECURE` | Your SMTP provider's values |

Optional (monitoring):

| Variable | Value |
| --- | --- |
| `SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN` | Only if you've set up Sentry |

Do **not** set a hard-coded `PORT` — Railway injects `PORT` itself, and
the app already listens on `0.0.0.0:$PORT` (see `Dockerfile`).

## 4. Configure the pre-deploy migration command

In the web service's **Settings → Deploy** section, set the **Pre-Deploy
Command** to:

```
npm run db:migrate
```

This runs `drizzle-kit migrate` against `DATABASE_URL` inside the built
image, before the new container starts serving traffic. If it fails, the
deploy stops and the previous container keeps serving — see
`docs/database.md` for what a failed migration means and how to recover.

(Railway's config-schema key for this has changed across versions, which
is why it's set in the dashboard here rather than asserted in
`railway.toml`.)

## 5. Set the health check path

In **Settings → Deploy**, confirm **Healthcheck Path** is `/api/health`
(this repo's `railway.toml` already sets this, but double-check it took
effect in the dashboard). Railway only routes traffic to a new container
once this returns 200.

## 6. First deploy

Trigger a deploy (push to `main`, or use "Deploy" in the dashboard).
Watch the build logs for the Docker build, then the pre-deploy migration
step, then the health check.

## 7. Generate a public domain

**Settings → Networking → Generate Domain**. Copy the generated
`*.up.railway.app` URL.

## 8. Update `APP_URL` and redeploy

Set `APP_URL` (step 3) to the domain from step 7, then redeploy (Railway
variable changes require a redeploy to take effect in a running
container).

## 9. Bootstrap the owner account

The bootstrap script runs inside the deployed container. From the
Railway dashboard, open a shell on the service (**Service → the ⋮ menu →
"Open Shell"**, or `railway run` locally against the linked project) and
run:

```bash
npm run bootstrap:owner
```

It refuses to run if an owner already exists, refuses a weak password,
never logs the password, and records the event in the `audit_events`
table. See `scripts/bootstrap-owner.ts`.

## 10. Sign in and rotate the temporary password

Sign in at `https://<your-domain>/sign-in` with `BOOTSTRAP_OWNER_EMAIL` /
`BOOTSTRAP_OWNER_PASSWORD`, then use the forgot-password flow (if email is
configured) or have another owner reset it, to move off the bootstrap
password.

## 11. Remove the bootstrap variables

Delete `BOOTSTRAP_OWNER_EMAIL`, `BOOTSTRAP_OWNER_PASSWORD`, and
`BOOTSTRAP_OWNER_NAME` from the service's variables once the owner
account exists. `npm run bootstrap:owner` is a no-op once an owner
exists, but there's no reason to leave a password sitting in your
environment variables.

## 12. Test backup and restore

Follow `docs/backup-and-recovery.md` end to end once against this
deployment before you rely on it, including an actual restore into a
throwaway database — not just confirming a backup file exists.

## 13. Custom domain (when ready)

1. **Settings → Networking → Custom Domain** — add your domain and note
   the CNAME/A record Railway gives you.
2. Update DNS at your registrar/DNS provider with that record.
3. Wait for TLS certificate validation (Railway handles this
   automatically once DNS resolves correctly; this can take anywhere from
   minutes to a few hours depending on DNS propagation).
4. Update `APP_URL` to the custom domain and redeploy.
5. If you use OAuth providers in the future, update their callback URLs
   to the new domain.
6. Test sign-in and sign-out on the new domain — cookies are
   domain-scoped, so a session created on the Railway-generated domain
   will not carry over to the custom domain.

## Railway environments (development / staging / production)

Create separate Railway environments (or separate projects) for each
stage, each with:

- its own Postgres service (**never** point staging at the production
  database)
- its own `AUTH_SECRET`
- its own `APP_URL`
- its own SMTP/storage configuration if applicable

For pull-request-based preview deployments, prefer Railway's PR
environments feature (which provisions a scoped database copy or a fresh
empty database, depending on your Railway plan) over sharing a single
staging database across concurrent PRs — concurrent migrations against a
shared database from different branches will conflict.

## Services in this deployment

- **Web service** — this repository, running the Next.js standalone
  server.
- **PostgreSQL service** — Railway-managed.

Not provisioned by default (see `docs/architecture.md` → "Optional
future services"): Redis, an object-storage bucket for evidence uploads,
a worker service, a cron service. Add these only when you actually need
them.
