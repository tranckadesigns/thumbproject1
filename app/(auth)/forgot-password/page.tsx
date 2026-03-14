import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-content-muted">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="rounded-xl border border-border bg-base-surface p-6">
        <ForgotPasswordForm />
      </div>

      <p className="mt-6 text-center text-sm text-content-muted">
        <Link href="/login" className="text-content-secondary hover:text-content-primary transition-colors">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
