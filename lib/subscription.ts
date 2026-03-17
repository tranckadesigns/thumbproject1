import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "inactive"
  | null;

interface Subscription {
  status: SubscriptionStatus;
  plan_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

/**
 * Returns the current user's subscription from Supabase.
 * Returns null if Supabase is not configured (demo mode).
 */
export async function getSubscription(): Promise<Subscription | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select(
      "status, plan_id, current_period_end, cancel_at_period_end, stripe_customer_id, stripe_subscription_id"
    )
    .eq("user_id", user.id)
    .single();

  return data ?? null;
}

/**
 * Returns true if the user has an active (or trialing) subscription.
 * In demo mode (no Supabase), always returns true.
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return true; // demo mode — open access

  const sub = await getSubscription();
  return sub?.status === "active" || sub?.status === "trialing";
}
