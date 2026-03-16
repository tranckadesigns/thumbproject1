"use client";

import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

export function OnboardingBanner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "1") {
      setVisible(true);
      // Clean the param from the URL without triggering navigation
      const params = new URLSearchParams(searchParams.toString());
      params.delete("welcome");
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
      // Auto-dismiss after 7s
      const t = setTimeout(() => setVisible(false), 7000);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-5 py-3.5">
      <div className="flex items-center gap-3">
        <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-content-primary">
            You&apos;re in — welcome to PSDfuel.
          </p>
          <p className="text-xs text-content-secondary">
            Your subscription is active.{" "}
            <Link href="/library" className="underline underline-offset-2 hover:text-content-primary transition-colors">
              Start exploring your library →
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 text-content-muted transition-colors hover:text-content-primary"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
