"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Menu, User, LogOut, LayoutDashboard, Library, Heart, Settings } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { signOutAction } from "@/app/(auth)/actions";
import { FavoritesNavButton } from "@/components/ui/favorites-nav-button";
import { cn } from "@/lib/utils/cn";

interface NavProps {
  isLoggedIn?: boolean;
  hasSubscription?: boolean;
  email?: string;
  displayName?: string;
}

function getInitials(displayName?: string, email?: string): string {
  const name = displayName?.trim();
  if (name) {
    const parts = name.split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return (email ?? "ME").slice(0, 2).toUpperCase();
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        isActive ? "text-content-primary" : "text-content-secondary hover:text-content-primary"
      )}
    >
      {label}
    </Link>
  );
}

const MEMBER_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library",   label: "Library",   icon: Library },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/account",   label: "Account",   icon: Settings },
];

export function Nav({ isLoggedIn, hasSubscription, email, displayName }: NavProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initials = getInitials(displayName, email);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Desktop right side ────────────────────────────────────────────────────
  let desktopNav: React.ReactNode;

  if (isLoggedIn && hasSubscription) {
    // Full member — show app nav links + profile dropdown
    desktopNav = (
      <>
        <NavLink href="/dashboard" label="Dashboard" />
        <Link
          href="/library"
          className="flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1 text-sm font-medium text-accent transition-all duration-200 hover:border-accent/70 hover:bg-accent/15"
          style={{ boxShadow: "0 0 14px rgba(201,169,110,0.14)" }}
        >
          <Library className="h-3.5 w-3.5" />
          Library
        </Link>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent hover:bg-accent/30 transition-colors"
            aria-label="Account menu"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 w-56 rounded-xl border border-border bg-base-surface shadow-2xl">
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs text-content-muted">Signed in as</p>
                <p className="truncate text-sm font-medium text-content-primary">{email}</p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/account"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-content-secondary hover:bg-base-overlay hover:text-content-primary transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  Account
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-content-secondary hover:bg-base-overlay hover:text-content-primary transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <FavoritesNavButton />
      </>
    );
  } else if (isLoggedIn && !hasSubscription) {
    // Logged in, no sub — get access button + profile dropdown
    desktopNav = (
      <>
        <Link
          href="/pricing"
          className={cn(buttonVariants({ size: "sm" }), "flex items-center gap-1.5")}
        >
          Get access
        </Link>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent hover:bg-accent/30 transition-colors"
            aria-label="Account menu"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 w-56 rounded-xl border border-border bg-base-surface shadow-2xl">
              <div className="border-b border-border px-4 py-3">
                <p className="text-xs text-content-muted">Signed in as</p>
                <p className="truncate text-sm font-medium text-content-primary">{email}</p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/account"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-content-secondary hover:bg-base-overlay hover:text-content-primary transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  Account
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-content-secondary hover:bg-base-overlay hover:text-content-primary transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else {
    // Logged out
    desktopNav = (
      <>
        <NavLink href="/login" label="Sign in" />
        <Link href="/signup" className={cn(buttonVariants({ size: "sm" }))}>
          Get access
        </Link>
      </>
    );
  }

  // ─── Mobile links ──────────────────────────────────────────────────────────
  const mobileLinks = isLoggedIn && hasSubscription
    ? MEMBER_LINKS
    : isLoggedIn
    ? [
        { href: "/",        label: "Home",    icon: LayoutDashboard },
        { href: "/pricing", label: "Pricing", icon: LayoutDashboard },
        { href: "/account", label: "Account", icon: Settings },
      ]
    : [
        { href: "/",        label: "Home",    icon: LayoutDashboard },
        { href: "/pricing", label: "Pricing", icon: LayoutDashboard },
        { href: "/login",   label: "Sign in", icon: User },
      ];

  return (
    <>
      {mounted && createPortal(
        <>
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

              {/* Email strip for logged-in users */}
              {isLoggedIn && email && (
                <div className="border-b border-border px-6 py-4">
                  <p className="text-xs text-content-muted">Signed in as</p>
                  <p className="truncate text-sm font-medium text-content-primary">{email}</p>
                </div>
              )}

              <nav className="flex flex-col gap-1 p-4">
                {mobileLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                  if (href === "/library") {
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-medium text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
                        style={{ boxShadow: "0 0 14px rgba(201,169,110,0.12)" }}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-base-surface text-content-primary"
                          : "text-content-primary hover:bg-base-surface"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto border-t border-border p-4 space-y-2">
                {isLoggedIn ? (
                  <form action={signOutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-content-primary hover:bg-base-surface transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </form>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
                    >
                      Get access
                    </Link>
                    <p className="text-center text-xs text-content-muted">
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
          <Link href="/" className="flex flex-shrink-0 items-center">
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {!hasSubscription && <NavLink href="/pricing" label="Pricing" />}
            {desktopNav}
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
