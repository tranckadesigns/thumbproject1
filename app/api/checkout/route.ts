import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/config/site";

export async function POST(request: NextRequest) {
  const { planId } = await request.json();

  if (!planId || !STRIPE_PRICE_IDS[planId]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = STRIPE_PRICE_IDS[planId];
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price not configured for this plan" },
      { status: 500 }
    );
  }

  // Get current user (optional — they may not be logged in yet)
  const supabase = await getSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  const baseUrl = siteConfig.url || request.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],

    // Pre-fill email if user is already logged in
    ...(user?.email ? { customer_email: user.email } : {}),

    // Pass user ID so webhook can link subscription to account
    metadata: {
      user_id: user?.id ?? "",
      plan_id: planId,
    },

    subscription_data: {
      metadata: {
        user_id: user?.id ?? "",
        plan_id: planId,
      },
    },

    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${baseUrl}/pricing`,

    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}
