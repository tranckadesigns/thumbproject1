import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkout canceled",
};

export default function CheckoutCancelPage() {
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
            className="text-content-muted"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
          No worries — nothing was charged.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-content-secondary">
          You canceled before completing checkout. Your card was not charged.
          You can start a new subscription whenever you&apos;re ready.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/pricing"
            className="flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-base transition-opacity hover:opacity-90"
          >
            View plans &amp; pricing
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-lg border border-border bg-base-elevated px-6 py-3 text-sm text-content-secondary transition-colors hover:border-border-strong hover:text-content-primary"
          >
            Back to homepage
          </Link>
        </div>

        <p className="mt-6 text-xs text-content-muted">
          Have a question?{" "}
          <a
            href="mailto:info@psdfuel.com"
            className="text-content-secondary underline-offset-2 hover:underline"
          >
            info@psdfuel.com
          </a>
        </p>
      </div>
    </div>
  );
}
