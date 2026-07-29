import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/layout/auth-card";
import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthCard
      title="Sign in"
      description="Continue your program."
      footer={
        <p className="text-center text-sm text-slate">
          New here?{" "}
          <Link href="/sign-up" className="text-accent hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
