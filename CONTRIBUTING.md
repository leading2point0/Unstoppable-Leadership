# Contributing

## Local setup

```bash
docker compose up -d
cp .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

## Before opening a pull request

```bash
npm run check   # format:check + lint + typecheck + test
npm run build
```

CI runs the same checks (`.github/workflows/ci.yml`) plus a security scan
(`.github/workflows/security.yml`).

## Code conventions

- Strict TypeScript; avoid `any` — if genuinely unavoidable, add a
  comment explaining why.
- Repositories (`src/repositories`) are the only layer that imports the
  Drizzle `db` client directly, and every function on a program-scoped
  table must call `assertProgramOwnership` (or an equivalent role check)
  before reading or writing.
- Validate all external input with Zod at the boundary (server action,
  route handler) — don't trust client-supplied data.
- Keep module *content* (`src/content/modules`) separate from the
  components that render it.
- Comments explain the non-obvious "why," not the "what" — well-named
  code should make the "what" unnecessary.

## Content changes

If you're editing or adding source/quote records, read
`docs/content-governance.md` first — there are hard rules there (never
seed quotations, unverified quotes never reach the public site, only an
owner can verify a quote) that are enforced in code, not just convention.

## Database schema changes

1. Edit `src/db/schema/*.ts`.
2. `npm run db:generate` to produce a new migration in `drizzle/`.
3. Review the generated SQL before committing it.
4. `npm run db:migrate` locally to apply and test it.
5. Commit both the schema change and the generated migration together.

## Commit messages

Focus on *why* a change was made, not a restatement of the diff.
