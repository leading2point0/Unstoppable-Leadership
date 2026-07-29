"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccountAction } from "@/lib/actions/auth-actions";

export function DeleteAccountButton() {
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <Button variant="destructive" onClick={() => setConfirming(true)}>
        Delete my account
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-critical bg-critical-bg p-4">
      <p className="text-sm text-critical">
        This permanently deletes your account and all program data. This cannot be undone. Type DELETE to confirm.
      </p>
      <Label htmlFor="confirm-delete" className="sr-only">Type DELETE to confirm</Label>
      <Input id="confirm-delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="max-w-xs" />
      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={confirmText !== "DELETE" || pending}
          onClick={() => startTransition(async () => { await deleteAccountAction(); })}
        >
          {pending ? "Deleting…" : "Permanently delete account"}
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
      </div>
    </div>
  );
}
