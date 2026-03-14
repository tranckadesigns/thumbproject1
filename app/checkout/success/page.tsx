import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SubscriptionActivationPoller } from "@/components/members/subscription-activation-poller";

export const metadata: Metadata = { title: "Welcome to PSDfuel" };

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 100%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Success icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10">
          <svg
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            className="text-emerald-400"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
            You&apos;re in. Welcome to PSDfuel.
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-content-secondary">
            Your subscription is active. The full library is yours — download any asset, any time.
          </p>
        </div>

        {/* What's next */}
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-border bg-base-surface p-5 text-left w-full max-w-xs">
          {[
            "Browse 180+ assets across 12 categories",
            "Download any PSD — instantly, no queue",
            "New assets added every month",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm text-content-secondary">{item}</span>
            </div>
          ))}
        </div>

        {/* Polls until subscription is active, then shows the button */}
        <Suspense fallback={null}>
          <SubscriptionActivationPoller />
        </Suspense>

        <p className="text-xs text-content-muted">
          Receipt sent to your email · Manage subscription in{" "}
          <Link href="/account" className="underline underline-offset-2 hover:text-content-secondary transition-colors">
            Account
          </Link>
        </p>
      </div>
    </div>
  );
}
