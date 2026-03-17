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
        Last updated: March 2026 · Trancka, Kennedylaan 51, 5571 KB Bergeijk, Netherlands
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        These Terms of Service govern your access to and use of PSDfuel, operated by
        Trancka (Kennedylaan 51, 5571 KB Bergeijk, Netherlands). Please read them
        carefully before subscribing.
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
