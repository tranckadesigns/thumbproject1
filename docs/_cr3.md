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
  const { error } = await supabase.from("subscriptions").upsert(
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
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}
```

---

## 15. app/(auth)/actions.ts

```typescript
"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
};

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    // Supabase not configured — pass through for local demo.
    redirect("/library");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/library");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/check-email");
}

export type UpdateDisplayNameState = { error: string | null; success: boolean };

export async function updateDisplayNameAction(
  _prevState: UpdateDisplayNameState,
  formData: FormData
): Promise<UpdateDisplayNameState> {
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Not configured.", success: false };

  const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
  if (error) return { error: error.message, success: false };
  return { error: null, success: true };
}

export type ForgotPasswordState = {
  error: string | null;
  success: boolean;
};

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Auth not configured.", success: false };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Always return success to avoid leaking whether an email exists
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return { error: null, success: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}
```

---

## 16. app/(auth)/signup/page.tsx

```typescript
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-content-muted">
          Step 1 of 2 — then choose your plan
        </p>
      </div>

      <div className="rounded-xl border border-border bg-base-surface p-6">
        <SignupForm />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-content-muted">
        <span className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          30-day money-back guarantee
        </span>
        <span className="opacity-30">·</span>
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}
```

---

## 17. app/(auth)/check-email/page.tsx

```typescript
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-base-surface">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-content-secondary">
          We&apos;ve sent you a confirmation email. Click the link inside to
          activate your account, then come back here to sign in.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-base-elevated px-4 py-3">
          <p className="text-xs text-content-muted">
            Didn&apos;t receive anything? Check your spam folder, or{" "}
            <Link
              href="/signup"
              className="text-content-secondary underline-offset-2 hover:underline"
            >
              try again with a different address
            </Link>
            .
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg border border-border bg-base-elevated px-6 py-3 text-sm text-content-secondary transition-colors hover:border-border-strong hover:text-content-primary"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 18. app/auth/callback/route.ts

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  // Validate next to prevent open redirect — must be a relative path
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("://")
    ? rawNext
    : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/forgot-password?error=link_expired`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
```

---

## 19. app/(admin)/layout.tsx

```typescript
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminEmail = process.env.ADMIN_EMAIL;

  let email = "admin@psdfuel.com";

  if (!demoMode) {
    const supabase = await getSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) redirect("/login");

    // If ADMIN_EMAIL is configured, enforce it
    if (adminEmail && user.email !== adminEmail) {
      redirect("/dashboard");
    }

    email = user.email ?? email;
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminNav email={email} />
      <main className="pl-56">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
```

---

## 20. next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

---

## 21. .env.example

```
# ─────────────────────────────────────────────────────────────────────────────
# PSDfuel — Environment Variables
# Copy this file to .env.local and fill in the values.
# Add all of these to Vercel: Settings → Environment Variables
# ─────────────────────────────────────────────────────────────────────────────

# ─── Supabase ─────────────────────────────────────────────────────────────────
# Create project at https://supabase.com
# Find these at: Project Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Find this at: Project Settings → API → service_role key (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── Stripe ───────────────────────────────────────────────────────────────────
# Create account at https://stripe.com
# Find keys at: Developers → API keys

STRIPE_SECRET_KEY=sk_live_...          # or sk_test_... for testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Create two recurring prices in Stripe Dashboard → Products
# Monthly: $19/month   → copy the price ID (starts with price_)
# Yearly:  $149/year   → copy the price ID (starts with price_)
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx

# Webhook secret — from Stripe Dashboard → Webhooks → your endpoint → Signing secret
# Local testing: use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ─── Cloudflare R2 (PSD file storage) ────────────────────────────────────────
# Create bucket at https://dash.cloudflare.com → R2
# Create API token: Manage R2 API Tokens → Create token (Object Read & Write)

R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=psdfuel-assets
R2_PUBLIC_URL=https://assets.psdfuel.com   # Custom domain on R2 bucket (optional)

# ─── Resend (transactional email) ─────────────────────────────────────────────
# Create account at https://resend.com
# Create API key at: API Keys → Create API Key