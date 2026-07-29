# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time-only placeholders so `next build` can statically analyze routes;
# real values are injected at runtime by Railway and are never baked into the image.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/build_placeholder"
ENV AUTH_SECRET="build-time-placeholder-not-used-at-runtime-000000"
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Full node_modules (not the standalone-pruned set) because Railway's
# pre-deploy command runs `npm run db:migrate` / `db:seed` / `bootstrap:owner`
# in this same image, and those use drizzle-kit and tsx against the
# TypeScript source — not just the compiled Next.js server.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY package.json drizzle.config.ts tsconfig.json ./
COPY drizzle ./drizzle
COPY scripts ./scripts
COPY src ./src

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Railway supplies PORT at runtime; server.js reads process.env.PORT and
# already binds to process.env.HOSTNAME (set to 0.0.0.0 above).
CMD ["node", "server.js"]
