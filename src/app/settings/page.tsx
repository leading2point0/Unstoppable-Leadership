import type { Metadata } from "next";
import { Download } from "lucide-react";
import { requireUser } from "@/lib/auth-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteAccountButton } from "@/components/forms/delete-account-button";
import { PRIVACY_LOCAL_FIRST_NOTICE } from "@/content/disclaimers";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="container-page container-prose py-10">
      <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase">Settings</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold">Account &amp; privacy</h1>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              <span className="text-slate">Name:</span> {user.name}
            </p>
            <p>
              <span className="text-slate">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-slate">Role:</span>{" "}
              <span className="capitalize">{user.role}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your data</CardTitle>
            <CardDescription>{PRIVACY_LOCAL_FIRST_NOTICE}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate text-sm">
              PostgreSQL is the source of truth for your account. Your export includes your
              programs, module progress, actions, habits, journal entries, weekly reviews,
              scorecards, and operating system — never your password hash or session tokens.
            </p>
            <Button asChild variant="outline">
              <a href="/api/export/me" download>
                <Download className="h-4 w-4" aria-hidden="true" /> Download my data (JSON)
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-critical">
          <CardHeader>
            <CardTitle className="text-base">Danger zone</CardTitle>
            <CardDescription>
              Deleting your account removes all of your program data permanently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeleteAccountButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
