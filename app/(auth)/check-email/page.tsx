import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-base-surface">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-content-secondary">
          We&apos;ve sent you a confirmation email. Click the link inside to
          activate your account, then come back here to sign in.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-base-elevated px-4 py-3">
          <p className="text-xs text-content-muted">
            Didn&apos;t receive anything? Check your spam folder, or{" "}
            <Link
              href="/signup"
              className="text-content-secondary underline-offset-2 hover:underline"
            >
              try again with a different address
            </Link>
            .
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg border border-border bg-base-elevated px-6 py-3 text-sm text-content-secondary transition-colors hover:border-border-strong hover:text-content-primary"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
