import { serverEnv } from "@/lib/env";

/**
 * In-memory fixed-window rate limiter. Suitable for a single-instance
 * deployment; if the app scales to multiple Railway replicas, swap this for
 * a Redis-backed limiter (see docs/architecture.md, "Optional future
 * services").
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

const MAX_BUCKETS = 5000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  if (!serverEnv.RATE_LIMIT_ENABLED) {
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowMs };
  }

  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      pruneExpired(now);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

function pruneExpired(now: number) {
  for (const [key, value] of buckets) {
    if (value.resetAt <= now) buckets.delete(key);
  }
}

export function loginRateLimit(identifier: string): RateLimitResult {
  return rateLimit(`login:${identifier}`, 8, 5 * 60 * 1000);
}

export function passwordResetRateLimit(identifier: string): RateLimitResult {
  return rateLimit(`reset:${identifier}`, 5, 15 * 60 * 1000);
}
