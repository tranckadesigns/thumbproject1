"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function MarketingError({
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
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h2 className="text-base font-semibold text-content-primary">Something went wrong</h2>
      <p className="mt-1.5 text-sm text-content-muted">
        An unexpected error occurred.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
