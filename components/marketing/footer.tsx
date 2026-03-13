import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Library", href: "/app/library" },
];

const accountLinks = [
  { label: "Get access", href: "/signup" },
  { label: "Sign in", href: "/login" },
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
          <div className="flex max-w-xs flex-col gap-3">
            <Wordmark />
            <p className="text-sm leading-relaxed text-content-muted">
              Premium editable PSD thumbnail assets for YouTube creators and
              professional designers.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <FooterLinkGroup heading="Product" links={productLinks} />
            <FooterLinkGroup heading="Account" links={accountLinks} />
          </div>
        </div>

        <Separator className="my-10" />

        <p className="text-xs text-content-muted">
          © {new Date().getFullYear()} Vaulted. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
