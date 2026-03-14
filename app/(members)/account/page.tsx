import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogOut, User, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/subscription";
import { signOutAction } from "@/app/(auth)/actions";
import { Badge } from "@/components/ui/badge";
import { BillingPortalButton } from "@/components/members/billing-portal-button";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Account",
};

const PLAN_LABELS: Record<string, string> = {
  monthly: "Monthly — $19/mo",
  yearly:  "Yearly — $149/yr",
};

const STATUS_BADGE: Record<string, { label: string; variant: "success" | "error" | "secondary" }> = {
  active:   { label: "Active",   variant: "success" },
  trialing: { label: "Trial",    variant: "success" },
  past_due: { label: "Past due", variant: "error" },
  canceled: { label: "Canceled", variant: "secondary" },
  inactive: { label: "Inactive", variant: "secondary" },
};

export default async function AccountPage() {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!user && !demoMode) {
    redirect("/login");
  }

  const memberSince = user?.created_at ? formatDate(user.created_at) : "—";
  const sub = user ? await getSubscription() : null;

  const statusInfo = sub?.status
    ? STATUS_BADGE[sub.status] ?? { label: sub.status, variant: "secondary" as const }
    : null;

  const periodEnd = sub?.current_period_end ? formatDate(sub.current_period_end) : null;
  const periodLabel = sub?.cancel_at_period_end ? "Expires on" : "Renews on";

  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-content-primary">
          Account
        </h1>

        <div className="space-y-4">
          {/* Profile card */}
          <div className="rounded-xl border border-border bg-base-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-base-overlay">
                <User className="h-4 w-4 text-content-muted" />
              </div>
              <p className="text-sm font-medium text-content-secondary uppercase tracking-wide">
                Profile
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs text-content-muted">Email address</p>
                <p className="text-sm font-medium text-content-primary">
                  {user?.email ?? "demo@psdfuel.com"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-content-muted">Member since</p>
                <p className="text-sm font-medium text-content-primary">{memberSince}</p>
              </div>
            </div>
          </div>

          {/* Subscription card */}
          <div className="rounded-xl border border-border bg-base-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-base-overlay">
                <CreditCard className="h-4 w-4 text-content-muted" />
              </div>
              <p className="text-sm font-medium text-content-secondary uppercase tracking-wide">
                Subscription
              </p>
            </div>

            {sub && statusInfo ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-content-primary">
                      {PLAN_LABELS[sub.plan_id ?? ""] ?? "PSDfuel Members"}
                    </p>
                    <p className="mt-0.5 text-xs text-content-muted">
                      Full library access · All categories
                    </p>
                  </div>
                  <Badge variant={statusInfo.variant as "success" | "error" | "secondary"}>{statusInfo.label}</Badge>
                </div>

                {periodEnd && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-base-elevated px-3 py-2.5">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-content-muted" />
                    <p className="text-xs text-content-muted">
                      {periodLabel} <span className="text-content-secondary">{periodEnd}</span>
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <BillingPortalButton />
                </div>

                {sub.cancel_at_period_end && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                    <p className="text-xs text-amber-400">
                      Your subscription is set to cancel. You keep access until {periodEnd}.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-content-primary">No active subscription</p>
                  <p className="mt-0.5 text-xs text-content-muted">
                    Subscribe to get full library access
                  </p>
                </div>
                <a
                  href="/pricing"
                  className="rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors"
                >
                  View plans
                </a>
              </div>
            )}
          </div>

          {/* Sign out */}
          <div className="rounded-xl border border-border bg-base-surface p-6">
            <form action={signOutAction} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-content-primary">Sign out</p>
                <p className="mt-0.5 text-xs text-content-muted">
                  You&apos;ll be redirected to the homepage.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
