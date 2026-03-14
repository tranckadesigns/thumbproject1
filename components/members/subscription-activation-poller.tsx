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
      <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
        Go to your dashboard
      </Link>
    );
  }

  if (attempts >= MAX_ATTEMPTS) {
    // Webhook took too long — just let them through
    return (
      <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
        Go to your dashboard
      </Link>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 text-sm text-content-muted">
      <Loader2 className="h-4 w-4 animate-spin" />
      Activating your account…
    </div>
  );
}
