import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set new password",
};

export default function ResetPasswordPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Set new password
        </h1>
        <p className="mt-1.5 text-sm text-content-muted">
          Choose a strong password for your account
        </p>
      </div>

      <div className="rounded-xl border border-border bg-base-surface p-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
