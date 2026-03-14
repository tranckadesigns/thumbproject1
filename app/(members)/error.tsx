"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MembersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-base-elevated">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-content-muted">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-base font-semibold text-content-primary">Something went wrong</h2>
      <p className="mt-1.5 text-sm text-content-muted">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
