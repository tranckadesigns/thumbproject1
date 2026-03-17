
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=info@psdfuel.com
```

---

## 22. lib/config/site.ts

```typescript
import { categoryNames } from "@/lib/config/categories";

export const siteConfig = {
  name: "PSDfuel",
  description:
    "Premium editable PSD thumbnail assets for YouTube creators and designers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://psdfuel.com",
  plans: {
    monthly: {
      id: "monthly",
      label: "Monthly",
      price: 19,
      interval: "month" as const,
    },
    yearly: {
      id: "yearly",
      label: "Yearly",
      price: 149,
      interval: "year" as const,
      savings: "Save 35%",
    },
  },
  categories: categoryNames,
} as const;

export type SitePlanId = keyof typeof siteConfig.plans;
export type AssetCategoryName = string;
```

---

## 23. components/marketing/announcement-bar.tsx

```typescript
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const STORAGE_KEY = "psdfuel-announcement-v1"

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center gap-2.5 border-b border-accent/15 bg-accent/[0.06] px-4 py-2 text-xs">
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>

      <p className="text-content-secondary">
        <span className="font-medium text-content-primary">Founding member pricing</span>
        {" — "}lock in <span className="font-semibold text-accent">$19/mo</span> at the founding rate before we raise prices.{" "}
        <Link
          href="/pricing"
          className="font-medium text-content-primary underline underline-offset-2 transition-colors hover:text-accent"
        >
          Claim your spot →
        </Link>
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="ml-1 shrink-0 text-content-muted/40 transition-colors hover:text-content-muted"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Founding spots progress — thin bar at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-accent/8">
        <div className="h-full bg-accent/50" style={{ width: "78%" }} />
      </div>
    </div>
  )
}
```

---

## 24. components/marketing/activity-toast.tsx

(Full content showing a component that displays user activity toasts with 56 sample activities interleaved with subscription/download actions, masking usernames, and rotating through at set intervals)

---

## 25. components/marketing/footer.tsx

```typescript
"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { label: "Pricing",         href: "/pricing" },
  { label: "Library",         href: "/library" },
  { label: "Sign in",         href: "/login" },
  { label: "Get access",      href: "/signup" },
];

const supportLinks = [
  { label: "info@psdfuel.com", href: "mailto:info@psdfuel.com" },
];

const legalLinks = [
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms of Service",href: "/terms" },
  { label: "Cookie Policy",   href: "/cookies" },
];

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium tracking-widest text-content-muted uppercase">
        {heading}
      </p>
      <nav className="flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-content-secondary transition-colors hover:text-content-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-base">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex max-w-xs flex-col gap-4">
            <Wordmark />
            <p className="text-sm leading-relaxed text-content-muted">
              Premium editable PSD thumbnail assets for YouTube creators and
              professional designers.
            </p>
            {/* Guarantee badge */}
            <div className="flex items-center gap-2 text-xs text-content-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              30-day money-back guarantee
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
            <FooterLinkGroup heading="Product"  links={productLinks} />
            <FooterLinkGroup heading="Legal"    links={legalLinks} />
            <FooterLinkGroup heading="Support"  links={supportLinks} />
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} PSDfuel. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-content-muted/50">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Payments secured by Stripe
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-xs text-content-muted/40 transition-colors hover:text-content-muted"
              aria-label="Scroll to top"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## 26. app/(marketing)/pricing/page.tsx

(First 100 lines shown - complete pricing page with hero, plan cards, testimonials, library snapshot, product highlights, included features, FAQ, and CTA sections. Full file is 497 lines.)

---

## 27. lib/mock/mock-assets.ts

(First 50 lines shown - demonstrates asset structure with id, slug, title, descriptions, category, style_type, metadata. Full file contains 39 assets with complete details across all categories.)

---

## 28. components/ui/checkout-button.tsx

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

interface CheckoutButtonProps {
  planId: "monthly" | "yearly";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      // Check if user is logged in
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/signup?plan=${planId}`);
          return;
        }
      }

      // Create Stripe checkout session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "contents" }}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(className)}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
```

---

## 29. app/(marketing)/terms/page.tsx

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  {
    heading: "Acceptance of terms",
    body: `By creating an account or accessing any part of PSDfuel, you agree to be bound by these Terms of Service. If you do not agree, do not use the service. We may update these terms from time to time — continued use after changes constitutes acceptance.`,
  },
  {
    heading: "Your subscription",
    body: `PSDfuel is a subscription-based service. Your subscription grants you a non-exclusive, non-transferable license to access and download assets from the library for the duration of your active subscription. Subscriptions renew automatically unless cancelled before the renewal date.`,
  },
  {
    heading: "What you can do with the assets",
    body: `Your subscription includes a commercial license. You may use downloaded assets in your own YouTube videos, client work, and sponsored content. You may not resell, redistribute, or sublicense the raw PSD files themselves, or include them in any product that competes with PSDfuel.`,
  },
  {
    heading: "What you cannot do",
    body: `You may not share your account credentials with others. You may not bulk-download assets for offline archiving or resale. You may not reverse-engineer, decompile, or use the files to build competing asset libraries. Violation of these terms will result in immediate account termination without refund.`,
  },
  {
    heading: "Cancellation and refunds",
    body: `You may cancel your subscription at any time. Access continues until the end of the current billing period. We offer a 30-day money-back guarantee for first-time subscribers — email info@psdfuel.com within 30 days of your first charge to request a full refund, no questions asked.`,
  },
  {
    heading: "Intellectual property",
    body: `All assets, designs, code, and content on PSDfuel remain the intellectual property of PSDfuel. Your subscription grants you a license to use the assets — it does not transfer ownership. We reserve all rights not expressly granted.`,
  },
  {
    heading: "Service availability",
    body: `We aim for 99.9% uptime but make no guarantees. We may perform maintenance, update the library, or modify features at any time. We are not liable for any loss caused by downtime or changes to the service.`,
  },
  {
    heading: "Limitation of liability",
    body: `To the maximum extent permitted by law, PSDfuel shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid in the 12 months prior to the claim.`,
  },
  {
    heading: "Governing law",
    body: `These terms are governed by the laws of the Netherlands. Any disputes shall be subject to the exclusive jurisdiction of Dutch courts.`,
  },
  {
    heading: "Contact",
    body: `Questions about these terms? Email us at info@psdfuel.com. We aim to respond within 5 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-content-muted">
        Last updated: March 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        These Terms of Service govern your access to and use of PSDfuel. Please
        read them carefully before subscribing.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-2 text-sm font-semibold text-content-primary">
              {s.heading}
            </h2>
            <p className="text-sm leading-relaxed text-content-secondary">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 30. app/(marketing)/privacy/page.tsx

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    heading: "What we collect",
    body: `When you create an account we collect your email address and a hashed password. When you subscribe we store your Stripe customer ID and subscription status — we never store raw card numbers. We also collect basic usage data (page views, download events) to improve the product.`,
  },
  {
    heading: "How we use your data",
    body: `Your email is used to send account-related messages (receipts, password resets, product updates). We do not sell or rent your data to third parties. Usage analytics are aggregated and never tied to personally identifiable information.`,
  },
  {
    heading: "Cookies",
    body: `We use a small number of cookies strictly necessary for authentication and session management. We also use analytics cookies (opt-in via our cookie banner) to understand how visitors use the site. See our Cookie Policy for full details.`,
  },
  {
    heading: "Third-party services",
    body: `We use Stripe for payment processing — your payment data is handled entirely by Stripe and subject to their privacy policy. We use Vercel for hosting and Supabase for our database, both of which process data in accordance with GDPR.`,
  },
  {
    heading: "Data retention",
    body: `Account data is retained for as long as your account is active. After account deletion, personal data is removed within 30 days. Anonymised analytics data may be retained indefinitely.`,
  },
  {
    heading: "Your rights (GDPR)",
    body: `If you are in the EEA you have the right to access, correct, export, or delete your personal data at any time. You also have the right to object to processing and to withdraw consent. To exercise any of these rights, email us at info@psdfuel.com.`,
  },
  {
    heading: "Changes to this policy",
    body: `We may update this policy from time to time. We will notify active subscribers of significant changes via email. The date at the top of this page reflects the most recent revision.`,
  },
  {
    heading: "Contact",
    body: `Questions about privacy? Email us at info@psdfuel.com. We aim to respond within 5 business days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-content-muted">
        Last updated: March 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        PSDfuel (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This
        policy explains what data we collect, how we use it, and your rights.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-2 text-sm font-semibold text-content-primary">
              {s.heading}
            </h2>
            <p className="text-sm leading-relaxed text-content-secondary">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

All files have been successfully read and presented. This is a comprehensive view of the PSDfuel platform's core infrastructure, including the database schema, service/repository layers, authentication, billing webhooks, UI components, and legal pages. The architecture demonstrates a clean separation between mock implementations and Supabase adapters, allowing for flexible switching between demo and production modes.agentId: a5ce552a247cb4708 (for resuming to continue this agent's work if needed)
<usage>total_tokens: 91662
tool_uses: 30
duration_ms: 141439</usage>