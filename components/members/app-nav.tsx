"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Menu, X, LayoutDashboard, Library, Settings } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { Wordmark } from "@/components/brand/wordmark";
import { UnlockButton } from "@/components/ui/unlock-button";
import { FavoritesNavButton } from "@/components/ui/favorites-nav-button";
import { cn } from "@/lib/utils/cn";

interface AppNavProps {
  email: string;
  hasSubscription?: boolean;
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        isActive
          ? "text-content-primary"
          : "text-content-secondary hover:text-content-primary"
      )}
    >
      {label}
    </Link>
  );
}

function LibraryNavLink() {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/library");

  return (
    <Link
      href="/library"
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-sm font-medium transition-all duration-200",
        isActive
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-accent/25 bg-accent/[0.05] text-accent/75 hover:border-accent/40 hover:bg-accent/[0.09] hover:text-accent"
      )}
      style={
        isActive
          ? { boxShadow: "0 0 14px rgba(201,169,110,0.14)" }
          : undefined
      }
    >
      <Library className="h-3.5 w-3.5" />
      Library
    </Link>
  );
}

const SUB_navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library",   label: "Library",   icon: Library },
];

const ACCOUNT_NAV_ITEM = { href: "/account", label: "Account", icon: Settings };

export function AppNav({ email, hasSubscription = false }: AppNavProps) {
  const navItems = hasSubscription
    ? [...SUB_navItems, ACCOUNT_NAV_ITEM]
    : [ACCOUNT_NAV_ITEM];
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initials = email.slice(0, 2).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border-subtle bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex-shrink-0">
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(({ href, label }) =>
              href === "/library" ? (
                <LibraryNavLink key={href} />
              ) : (
                <NavLink key={href} href={href} label={label} />
              )
            )}

            {/* Favorites heart button — only for subscribers */}
            {hasSubscription && <FavoritesNavButton />}

            {/* Upgrade CTA for non-subscribers */}
            {!hasSubscription && (
              <UnlockButton size="sm" label="Get access" />
            )}

            {/* Profile dropdown */}
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-base md:hidden">
          {/* Header */}
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

          {/* Email */}
          <div className="border-b border-border px-6 py-4">
            <p className="text-xs text-content-muted">Signed in as</p>
            <p className="truncate text-sm font-medium text-content-primary">{email}</p>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              if (href === "/library") {
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-accent/20 bg-accent/[0.05] text-accent/80 hover:border-accent/35 hover:bg-accent/[0.09] hover:text-accent"
                    )}
                    style={isActive ? { boxShadow: "0 0 14px rgba(201,169,110,0.12)" } : undefined}
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
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-base-surface text-content-primary"
                      : "text-content-secondary hover:bg-base-surface hover:text-content-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            {/* Upgrade CTA for non-subscribers */}
            {!hasSubscription && (
              <div className="border-t border-border p-4">
                <UnlockButton label="Get full access" className="w-full justify-center" />
              </div>
            )}

            {/* Sign out */}
            <div className="border-t border-border p-4">
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-content-secondary hover:bg-base-surface hover:text-content-primary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
