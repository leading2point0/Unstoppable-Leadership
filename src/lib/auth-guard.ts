import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { sessions } from "@/db/schema";
import { type UserRole, roleAtLeast } from "@/types/domain";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  sessionId: string;
}

/**
 * Resolves the current session and confirms the server-tracked session row
 * hasn't been revoked (administrative "sign out everywhere" / account
 * deletion). This is what makes revocation real under a JWT strategy.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user?.id || !session.sessionId) return null;

  const [sessionRow] = await db
    .select({ revokedAt: sessions.revokedAt, expiresAt: sessions.expiresAt })
    .from(sessions)
    .where(eq(sessions.id, session.sessionId))
    .limit(1);

  if (!sessionRow || sessionRow.revokedAt || sessionRow.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "",
    role: session.user.role,
    sessionId: session.sessionId,
  };
}

/** Server Component / route handler guard: redirects to sign-in when unauthenticated. */
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/sign-in");
  return user;
}

/** Server Component / route handler guard: redirects when the user lacks the minimum role. */
export async function requireRole(minimum: UserRole): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (!roleAtLeast(user.role, minimum)) redirect("/dashboard");
  return user;
}
