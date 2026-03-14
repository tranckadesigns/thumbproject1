"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, ArrowLeft, Shield } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/admin",        label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/assets", label: "Assets",    icon: Layers },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border bg-base">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <Wordmark />
        <span className="ml-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-base-overlay text-content-primary"
                  : "text-content-secondary hover:bg-base-surface hover:text-content-primary"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-0.5">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2">
          <Shield className="h-3.5 w-3.5 flex-shrink-0 text-content-muted" />
          <p className="truncate text-xs text-content-muted">{email}</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-content-secondary hover:bg-base-surface hover:text-content-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          Back to app
        </Link>
      </div>
    </aside>
  );
}
