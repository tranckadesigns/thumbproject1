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
        Last updated: March 2026 · Data controller: Trancka, Kennedylaan 51, 5571 KB Bergeijk, Netherlands
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        PSDfuel is operated by Trancka (&ldquo;we&rdquo;, &ldquo;our&rdquo;), Kennedylaan 51,
        5571 KB Bergeijk, Netherlands. We are committed to protecting your privacy. This
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
