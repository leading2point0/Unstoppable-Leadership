import { z } from "zod";

/**
 * Server-only environment variables. Never import this module from a
 * "use client" component — secrets here must not reach the browser bundle.
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_TRUST_HOST: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  BOOTSTRAP_OWNER_EMAIL: z.string().email().optional(),
  BOOTSTRAP_OWNER_PASSWORD: z.string().optional(),
  BOOTSTRAP_OWNER_NAME: z.string().optional(),
  ALLOW_PUBLIC_REGISTRATION: z
    .string()
    .optional()
    .default("false")
    .transform((v) => v === "true"),
  EMAIL_FROM: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  STORAGE_PROVIDER: z.enum(["local", "s3", "railway"]).default("local"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  STORAGE_ENDPOINT: z.string().optional(),
  RATE_LIMIT_ENABLED: z
    .string()
    .optional()
    .default("true")
    .transform((v) => v !== "false"),
  SENTRY_DSN: z.string().optional(),
  RAILWAY_GIT_COMMIT_SHA: z.string().optional(),
  APP_VERSION: z.string().optional(),
});

/**
 * Public, browser-visible environment variables. Must be prefixed with
 * NEXT_PUBLIC_ so Next.js inlines them at build time.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default("Unstoppable Action Lab"),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;
type PublicEnv = z.infer<typeof publicEnvSchema>;

function loadServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    const message = `Invalid or missing environment variables:\n${issues}`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }
    // eslint-disable-next-line no-console
    console.warn(`[env] ${message}`);
    return serverEnvSchema.parse({
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/unstoppable",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "development-only-insecure-secret",
    });
  }
  return parsed.data;
}

function loadPublicEnv(): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });
}

export const serverEnv = loadServerEnv();
export const publicEnv = loadPublicEnv();

export const appVersion = serverEnv.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) ?? serverEnv.APP_VERSION ?? "development";
