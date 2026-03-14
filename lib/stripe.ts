import Stripe from "stripe";

// Using ?? "missing" avoids a build-time crash when the env var is not yet
// available during static analysis. At runtime the real key is injected by Vercel.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "missing", {
  apiVersion: "2026-02-25.clover",
});

// Map our internal plan IDs to Stripe price IDs (set in env vars)
export const STRIPE_PRICE_IDS: Record<string, string> = {
  monthly: process.env.STRIPE_PRICE_MONTHLY ?? "",
  yearly:  process.env.STRIPE_PRICE_YEARLY  ?? "",
};
