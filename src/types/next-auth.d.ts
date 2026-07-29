import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/domain";

declare module "next-auth" {
  interface User {
    role?: UserRole;
    sessionId?: string;
  }

  interface Session {
    sessionId?: string;
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    sid?: string;
  }
}
