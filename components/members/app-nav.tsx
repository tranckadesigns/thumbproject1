"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(auth)/actions";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/utils/cn";

interface AppNavProps {
  email: string;
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/library" && pathname.startsWith(href));

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
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border-subtle bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/library" className="flex-shrink-0">
          <Wordmark />
        </Link>

        <nav className="flex items-center gap-7">
          <NavLink href="/library" label="Library" />
          <NavLink href="/account" label="Account" />

          <form action={signOutAction}>
            <button
              type="submit"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent hover:bg-accent/30 transition-colors"
              title={`Signed in as ${email} — click to sign out`}
            >
              {initials}
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
