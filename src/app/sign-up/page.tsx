import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/forms/sign-up-form";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Create account" };

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      description="The first account created on a fresh deployment becomes the owner account."
      footer={
        <p className="text-center text-sm text-slate">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
