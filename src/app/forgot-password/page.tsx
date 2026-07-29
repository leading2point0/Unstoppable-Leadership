import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset your password" description="We'll email you a link if email delivery is configured on this deployment.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
