import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy" };

const sections = [
  {
    heading: "What are cookies?",
    body: `Cookies are small text files that a website stores on your device when you visit. They are widely used to make websites work efficiently and to provide information to website owners.`,
  },
  {
    heading: "Strictly necessary cookies",
    body: `These cookies are essential for the site to function. They include session tokens, authentication state, and CSRF protection tokens. These cannot be disabled — without them the service cannot operate.`,
  },
  {
    heading: "Analytics cookies (opt-in)",
    body: `With your consent, we use analytics cookies to understand how visitors interact with the site — which pages are visited, where users drop off, and how long they engage. This data is aggregated and never tied to personally identifiable information. You can opt in or out via our cookie banner at any time.`,
  },
  {
    heading: "Preference cookies",
    body: `We store lightweight preferences — such as whether you have dismissed the announcement bar or accepted the cookie banner — in your browser's localStorage. These are not transmitted to our servers and are cleared when you clear browser data.`,
  },
  {
    heading: "Third-party cookies",
    body: `Stripe, our payment processor, may set cookies during checkout. These are governed by Stripe's own Cookie Policy. We do not use advertising, retargeting, or social tracking cookies of any kind.`,
  },
  {
    heading: "Managing cookies",
    body: `You can control and delete cookies through your browser settings. Disabling strictly necessary cookies will break authentication and prevent you from logging in. You can withdraw analytics consent at any time by clicking the cookie preferences link in the footer.`,
  },
  {
    heading: "Changes",
    body: `We may update this policy when we add or remove cookies. Significant changes will be communicated via the cookie banner on your next visit.`,
  },
  {
    heading: "Contact",
    body: `Questions about our use of cookies? Email privacy@psdfuel.com.`,
  },
];

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
        Cookie Policy
      </h1>
      <p className="mt-3 text-sm text-content-muted">
        Last updated: March 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        This policy explains what cookies we use on PSDfuel, why we use them,
        and how you can control them.
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
