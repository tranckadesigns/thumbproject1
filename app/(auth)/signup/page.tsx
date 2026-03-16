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

      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-content-muted">
        <span className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          30-day money-back guarantee
        </span>
        <span className="opacity-30">·</span>
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}
