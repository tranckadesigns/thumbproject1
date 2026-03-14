import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-content-muted">
          Step 1 of 2 — then choose your plan
        </p>
      </div>

      <div className="rounded-xl border border-border bg-base-surface p-6">
        <SignupForm />
      </div>
    </div>
  );
}
