"use client";

import { useActionState } from "react";
import { requestPasswordResetAction, type ActionResult } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionResult | undefined = undefined;

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  if (state?.ok) {
    return (
      <p className="rounded-md bg-success-bg px-3 py-2 text-sm text-success" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state && !state.ok && (
        <p className="rounded-md bg-critical-bg px-3 py-2 text-sm text-critical" role="alert">
          {state.message}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
