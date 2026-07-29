import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { signInSchema } from "@/schemas/auth";
import { loginRateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { serverEnv } from "@/lib/env";
import type { UserRole } from "@/types/domain";

const LOCKOUT_THRESHOLD = 8;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: serverEnv.AUTH_TRUST_HOST || serverEnv.NODE_ENV !== "production",
  secret: serverEnv.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_SECONDS },
  pages: { signIn: "/sign-in" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials, request) {
        const parsed = signInSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const rateLimitResult = loginRateLimit(`${ip}:${email.toLowerCase()}`);
        if (!rateLimitResult.allowed) {
          await logAuditEvent({ action: "auth.login.rate_limited", details: { email }, ipAddress: ip });
          return null;
        }

        const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        if (!user || !user.passwordHash || !user.isActive) {
          return null;
        }

        if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
          await logAuditEvent({ actorId: user.id, action: "auth.login.locked_out", ipAddress: ip });
          return null;
        }

        const passwordValid = await verifyPassword(password, user.passwordHash);
        if (!passwordValid) {
          const attempts = user.failedLoginAttempts + 1;
          await db
            .update(users)
            .set({
              failedLoginAttempts: attempts,
              lockedUntil: attempts >= LOCKOUT_THRESHOLD ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null,
            })
            .where(eq(users.id, user.id));
          await logAuditEvent({ actorId: user.id, action: "auth.login.failed", ipAddress: ip });
          return null;
        }

        await db
          .update(users)
          .set({ failedLoginAttempts: 0, lockedUntil: null })
          .where(eq(users.id, user.id));

        const [session] = await db
          .insert(sessions)
          .values({
            userId: user.id,
            userAgent: request.headers.get("user-agent"),
            ipAddress: ip,
            expiresAt: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
          })
          .returning();

        await logAuditEvent({ actorId: user.id, action: "auth.login.success", ipAddress: ip });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          sessionId: session.id,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sid = user.sessionId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.sessionId = token.sid as string;
      }
      return session;
    },
  },
});
