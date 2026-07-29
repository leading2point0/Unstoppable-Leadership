"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/lib/actions/sign-in-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const registered = searchParams.get("registered");
  const reset = searchParams.get("reset");
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {registered && (
        <p className="rounded-md bg-success-bg px-3 py-2 text-sm text-success" role="status">
          Account created. Sign in to continue.
        </p>
      )}
      {reset && (
        <p className="rounded-md bg-success-bg px-3 py-2 text-sm text-success" role="status">
          Password updated. Sign in with your new password.
        </p>
      )}
      {state && !state.ok && (
        <p className="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical" role="alert">
          {state.message}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="/forgot-password" className="text-xs text-accent hover:underline">
            Forgot password?
          </a>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
