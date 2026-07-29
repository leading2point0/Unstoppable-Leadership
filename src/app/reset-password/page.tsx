import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthCard title="Invalid link" description="This password reset link is missing its token.">
        <p className="text-slate text-sm">
          Request a new reset link from the forgot-password page.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" description="Set a new password for your account.">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
