"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import type { ActionResult } from "@/lib/actions/auth-actions";

export async function signInAction(_prev: ActionResult | undefined, formData: FormData): Promise<ActionResult> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: callbackUrl,
    });
    return { ok: true, message: "Signed in." };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Incorrect email or password, or this account is temporarily locked." };
    }
    // NextAuth throws a special redirect error on success — let it propagate.
    throw error;
  }
}
