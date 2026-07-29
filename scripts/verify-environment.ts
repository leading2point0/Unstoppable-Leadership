/**
 * Fails fast with a clear message when required production environment
 * variables are missing or unsafe. Intended to run before `next build` or
 * as a Railway pre-deploy sanity check.
 */
const isProduction = process.env.NODE_ENV === "production";

const problems: string[] = [];

if (!process.env.DATABASE_URL) {
  problems.push("DATABASE_URL is not set.");
}

if (!process.env.AUTH_SECRET) {
  problems.push("AUTH_SECRET is not set.");
} else if (isProduction && process.env.AUTH_SECRET.length < 32) {
  problems.push("AUTH_SECRET should be at least 32 characters in production.");
}

if (isProduction && process.env.ALLOW_PUBLIC_REGISTRATION === "true") {
  console.warn(
    "[verify:env] WARNING: ALLOW_PUBLIC_REGISTRATION=true in production. Confirm this is intentional.",
  );
}

if (isProduction && (!process.env.SMTP_HOST || !process.env.EMAIL_FROM)) {
  console.warn(
    "[verify:env] WARNING: no SMTP configuration found. Password-reset emails will not be sent; " +
      "the admin bootstrap flow must be used instead until email is configured.",
  );
}

if (problems.length > 0) {
  console.error("Environment verification failed:");
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log("Environment verification passed.");
