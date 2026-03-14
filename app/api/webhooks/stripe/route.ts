/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// In Stripe API >= 2025-x, current_period_end moved to the item level
function getPeriodEnd(sub: any): string {
  const ts =
    sub.current_period_end ??
    sub.items?.data?.[0]?.current_period_end ??
    sub.billing_cycle_anchor;
  if (!ts) return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  return new Date(ts * 1000).toISOString();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  try {
    switch (event.type) {
      // ── Checkout completed → subscription created ──────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as any;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id;
        const subId  = session.subscription as string;
        const custId = session.customer as string;

        if (!userId || !subId) break;

        const sub = await stripe.subscriptions.retrieve(subId) as any;

        await upsertSubscription(supabase, {
          userId,
          stripeCustomerId:     custId,
          stripeSubscriptionId: subId,
          status:               sub.status,
          planId:               planId ?? null,
          currentPeriodEnd:     getPeriodEnd(sub),
          cancelAtPeriodEnd:    sub.cancel_at_period_end ?? false,
        });
        break;
      }

      // ── Subscription updated (renewal, plan change, cancel scheduled) ──────
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await upsertSubscription(supabase, {
          userId,
          stripeCustomerId:     sub.customer as string,
          stripeSubscriptionId: sub.id,
          status:               sub.status,
          planId:               sub.metadata?.plan_id ?? null,
          currentPeriodEnd:     getPeriodEnd(sub),
          cancelAtPeriodEnd:    sub.cancel_at_period_end ?? false,
        });
        break;
      }

      // ── Subscription canceled / deleted ────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await upsertSubscription(supabase, {
          userId,
          stripeCustomerId:     sub.customer as string,
          stripeSubscriptionId: sub.id,
          status:               "canceled",
          planId:               sub.metadata?.plan_id ?? null,
          currentPeriodEnd:     getPeriodEnd(sub),
          cancelAtPeriodEnd:    true,
        });
        break;
      }

      // ── Payment failed ─────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        if (!invoice.subscription) break;

        const sub = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        ) as any;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Webhook handler error:", message);
    return NextResponse.json({ error: "Handler failed", detail: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function upsertSubscription(
  supabase: any,
  data: {
    userId:               string;
    stripeCustomerId:     string;
    stripeSubscriptionId: string;
    status:               string;
    planId:               string | null;
    currentPeriodEnd:     string;
    cancelAtPeriodEnd:    boolean;
  }
) {
  await supabase.from("subscriptions").upsert(
    {
      user_id:                data.userId,
      stripe_customer_id:     data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId,
      status:                 data.status,
      plan_id:                data.planId,
      current_period_end:     data.currentPeriodEnd,
      cancel_at_period_end:   data.cancelAtPeriodEnd,
      updated_at:             new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}
