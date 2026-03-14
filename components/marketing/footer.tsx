"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { label: "Pricing",         href: "/pricing" },
  { label: "Library",         href: "/app/library" },
  { label: "Sign in",         href: "/login" },
  { label: "Get access",      href: "/signup" },
];

const legalLinks = [
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms of Service",href: "/terms" },
  { label: "Cookie Policy",   href: "/cookies" },
];

const socialLinks = [
  {
    label: "X / Twitter",
    href: "https://twitter.com/vaultedpsd",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.256 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
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
            {/* Social */}
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-content-muted/50 transition-colors hover:text-content-muted"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <FooterLinkGroup heading="Product"  links={productLinks} />
            <FooterLinkGroup heading="Legal"    links={legalLinks} />
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} Vaulted. All rights reserved.
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
