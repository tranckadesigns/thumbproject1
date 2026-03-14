"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Menu, Lock } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface NavProps {
  isLoggedIn?: boolean;
  hasSubscription?: boolean;
}

export function Nav({ isLoggedIn, hasSubscription }: NavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        pathname === href
          ? "text-content-primary"
          : "text-content-secondary hover:text-content-primary"
      )}
    >
      {label}
    </Link>
  );

  // Library button state based on auth + subscription
  const libraryButton = isLoggedIn ? (
    hasSubscription ? (
      <Link href="/library" className={cn(buttonVariants({ size: "sm" }))}>
        Library
      </Link>
    ) : (
      <Link
        href="/pricing"
        className={cn(
          buttonVariants({ size: "sm", variant: "secondary" }),
          "flex items-center gap-1.5 opacity-70"
        )}
        title="Active subscription required"
      >
        <Lock className="h-3 w-3" />
        Library
      </Link>
    )
  ) : (
    <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
      Get access
    </Link>
  );

  return (
    <>
      {mounted && createPortal(
        <>
          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-[200] flex flex-col bg-base md:hidden">
              <div className="flex h-14 items-center justify-between border-b border-border px-6">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Wordmark />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-content-muted transition-colors hover:border-border-strong hover:text-content-primary"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 p-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/pricing", label: "Pricing" },
                  ...(isLoggedIn
                    ? [
                        { href: "/library", label: "Library" },
                        { href: "/account", label: "Account" },
                      ]
                    : [
                        { href: "/login", label: "Sign in" },
                      ]
                  ),
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-base-surface text-content-primary"
                        : "text-content-secondary hover:bg-base-surface hover:text-content-primary"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto border-t border-border p-6">
                {isLoggedIn ? (
                  <Link
                    href={hasSubscription ? "/library" : "/pricing"}
                    className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
                  >
                    {hasSubscription ? "Go to library" : "Upgrade to access"}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
                    >
                      Get access
                    </Link>
                    <p className="mt-3 text-center text-xs text-content-muted">
                      Monthly from $19 · Cancel anytime
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </>,
        document.body
      )}

      <header className="sticky top-0 z-50 h-14 w-full border-b border-border-subtle bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex-shrink-0">
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLink("/pricing", "Pricing")}
            {isLoggedIn ? (
              <>
                {navLink("/account", "Account")}
                {libraryButton}
              </>
            ) : (
              <>
                {navLink("/login", "Sign in")}
                {libraryButton}
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-content-muted transition-colors hover:border-border-strong hover:text-content-primary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>
    </>
  );
}
