"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/utils/cn";

interface AppNavProps {
  email: string;
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

export function AppNav({ email }: AppNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = email.slice(0, 2).toUpperCase();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border-subtle bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex-shrink-0">
          <Wordmark />
        </Link>

        <nav className="flex items-center gap-7">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/library" label="Library" />
          <NavLink href="/account" label="Account" />

          {/* Profile dropdown */}
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent hover:bg-accent/30 transition-colors"
              aria-label="Account menu"
            >
              {initials}
            </button>

            {open && (
              <div className="absolute right-0 top-10 w-56 rounded-xl border border-border bg-base-surface shadow-2xl">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-xs text-content-muted">Signed in as</p>
                  <p className="truncate text-sm font-medium text-content-primary">{email}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    href="/account"
                    onClick={() => setOpen(false)}
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
      </div>
    </header>
  );
}
