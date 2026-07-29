"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { passwordResetTokens, sessions, users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { requestPasswordResetSchema, resetPasswordSchema, signUpSchema } from "@/schemas/auth";
import { serverEnv } from "@/lib/env";
import { sendMail, isEmailConfigured } from "@/lib/mailer";
import { logAuditEvent } from "@/lib/audit";
import { passwordResetRateLimit } from "@/lib/rate-limit";
import { getAuthenticatedUser, requireUser } from "@/lib/auth-guard";
import { signOut } from "@/lib/auth";

export interface ActionResult {
  ok: boolean;
  message: string;
}

export async function signUpAction(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  if (!serverEnv.ALLOW_PUBLIC_REGISTRATION) {
    const existingOwner = await db.select().from(users).where(eq(users.role, "owner")).limit(1);
    if (existingOwner.length > 0) {
      return { ok: false, message: "Public registration is currently disabled. Ask an administrator for an invitation." };
    }
  }

  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { ok: false, message: "An account with that email already exists." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const [firstUser] = await db.select({ id: users.id }).from(users).limit(1);
  const role = firstUser ? "participant" : "owner"; // first account ever created becomes owner

  const [user] = await db
    .insert(users)
    .values({ name: parsed.data.name, email, passwordHash, role })
    .returning();

  await logAuditEvent({ actorId: user.id, action: "auth.signup", details: { email, role } });
  redirect("/sign-in?registered=1");
}

export async function requestPasswordResetAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = requestPasswordResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitResult = passwordResetRateLimit(`${ip}:${parsed.data.email.toLowerCase()}`);
  if (!rateLimitResult.allowed) {
    return { ok: false, message: "Too many reset requests. Try again later." };
  }

  if (!isEmailConfigured()) {
    return {
      ok: false,
      message:
        "Email delivery is not configured on this deployment, so a reset link cannot be sent. Contact the site administrator, who can reset your password directly.",
    };
  }

  const email = parsed.data.email.toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  // Always return a generic success message so this endpoint cannot be used to enumerate accounts.
  const genericMessage = "If an account exists for that email, a reset link has been sent.";

  if (!user) return { ok: true, message: genericMessage };

  const token = crypto.randomUUID();
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  const resetUrl = `${process.env.APP_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;
  await sendMail({
    to: user.email,
    subject: "Reset your Unstoppable Action Lab password",
    text: `Reset your password: ${resetUrl}\n\nThis link expires in one hour. If you did not request this, you can ignore this email.`,
  });

  await logAuditEvent({ actorId: user.id, action: "auth.password_reset.requested" });
  return { ok: true, message: genericMessage };
}

export async function resetPasswordAction(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const [tokenRow] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, parsed.data.token))
    .limit(1);

  if (!tokenRow || tokenRow.usedAt || tokenRow.expiresAt.getTime() < Date.now()) {
    return { ok: false, message: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await db.update(users).set({ passwordHash, failedLoginAttempts: 0, lockedUntil: null }).where(eq(users.id, tokenRow.userId));
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, tokenRow.id));
  await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.userId, tokenRow.userId));

  await logAuditEvent({ actorId: tokenRow.userId, action: "auth.password_reset.completed" });
  redirect("/sign-in?reset=1");
}

export async function signOutAction(): Promise<void> {
  const user = await getAuthenticatedUser();
  if (user) {
    await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, user.sessionId));
    await logAuditEvent({ actorId: user.id, action: "auth.logout" });
  }
  await signOut({ redirectTo: "/" });
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const user = await requireUser();
  await logAuditEvent({ actorId: user.id, action: "account.deleted", details: { email: user.email } });
  await db.delete(users).where(eq(users.id, user.id));
  await signOut({ redirectTo: "/" });
  return { ok: true, message: "Account deleted." };
}
