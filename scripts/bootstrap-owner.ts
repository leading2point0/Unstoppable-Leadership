/**
 * Creates the initial "owner" account from environment variables.
 *
 * Safe by design:
 *  - Refuses to run if an owner already exists.
 *  - Refuses weak passwords.
 *  - Never logs the password.
 *  - Records the bootstrap event in the audit log.
 *
 * Usage: npm run bootstrap:owner
 * (Run once after the first deploy, then remove BOOTSTRAP_OWNER_* from
 * the environment and redeploy.)
 */
import { eq } from "drizzle-orm";
import { db, rawSql } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, isPasswordStrongEnough } from "@/lib/password";
import { logAuditEvent } from "@/lib/audit";

async function main() {
  const email = process.env.BOOTSTRAP_OWNER_EMAIL;
  const password = process.env.BOOTSTRAP_OWNER_PASSWORD;
  const name = process.env.BOOTSTRAP_OWNER_NAME ?? "Site Owner";

  if (!email || !password) {
    console.error(
      "BOOTSTRAP_OWNER_EMAIL and BOOTSTRAP_OWNER_PASSWORD must be set to bootstrap an owner account.",
    );
    process.exitCode = 1;
    return;
  }

  if (!isPasswordStrongEnough(password)) {
    console.error("BOOTSTRAP_OWNER_PASSWORD is too weak. Use at least 12 characters with letters and a number/symbol.");
    process.exitCode = 1;
    return;
  }

  const [existingOwner] = await db.select().from(users).where(eq(users.role, "owner")).limit(1);
  if (existingOwner) {
    console.log(`An owner account already exists (${existingOwner.email}). No changes made.`);
    return;
  }

  const [existingByEmail] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  if (existingByEmail) {
    console.error(`A user with email ${email} already exists but is not an owner. Refusing to overwrite.`);
    process.exitCode = 1;
    return;
  }

  const passwordHash = await hashPassword(password);
  const [owner] = await db
    .insert(users)
    .values({
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: "owner",
      emailVerifiedAt: new Date(),
    })
    .returning();

  await logAuditEvent({ actorId: owner.id, action: "owner.bootstrap.created", details: { email: owner.email } });

  console.log(`Owner account created: ${owner.email}`);
  console.log("Sign in, then remove BOOTSTRAP_OWNER_EMAIL / BOOTSTRAP_OWNER_PASSWORD from your environment.");
}

main()
  .catch((error) => {
    console.error("Owner bootstrap failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await rawSql.end({ timeout: 5 });
  });
