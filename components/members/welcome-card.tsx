"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const DISMISSED_KEY = "psdfuel_welcome_dismissed";

export function WelcomeCard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-transparent px-6 py-5">
      <button
        onClick={dismiss}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-md text-content-muted transition-colors hover:text-content-primary"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z" fill="#C9A96E" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-content-primary">
            Welcome to PSDfuel — your library is ready.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-content-secondary">
            Browse the full collection, save favorites, and download any PSD instantly.
          </p>
          <Link
            href="/library"
            onClick={dismiss}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent/80"
          >
            Start exploring <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
