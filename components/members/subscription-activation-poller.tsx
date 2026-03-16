"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const MAX_ATTEMPTS = 10;
const INTERVAL_MS = 2000;

export function SubscriptionActivationPoller() {
  const [active, setActive] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (active || attempts >= MAX_ATTEMPTS) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/subscription-status");
        const { active: isActive } = await res.json();
        if (isActive) {
          setActive(true);
        } else {
          setAttempts(a => a + 1);
        }
      } catch {
        setAttempts(a => a + 1);
      }
    }, attempts === 0 ? 1000 : INTERVAL_MS);

    return () => clearTimeout(timer);
  }, [active, attempts]);

  if (active) {
    return (
      <Link href="/dashboard?welcome=1" className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
        Go to your dashboard
      </Link>
    );
  }

  if (attempts >= MAX_ATTEMPTS) {
    return (
      <div className="mt-2 space-y-4 text-center">
        <p className="text-sm text-content-muted">
          Your payment was received — activation is taking a little longer than expected.
          Try refreshing the page. If you still don&apos;t have access, we&apos;re here to help.
        </p>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Refresh page
          </button>
          <a
            href="mailto:support@psdfuel.com"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Contact support
          </a>
        </div>
        <Link href="/dashboard?welcome=1" className={cn(buttonVariants({ size: "lg" }))}>
          Go to your dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-sm text-content-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      Activating your account…
    </div>
  );
}
