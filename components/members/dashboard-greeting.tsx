"use client";

import Link from "next/link";

interface DashboardGreetingProps {
  email: string;
  renewalDate: string | null;
  renewalLabel: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardGreeting({ email, renewalDate, renewalLabel }: DashboardGreetingProps) {
  const greeting = getGreeting();
  const name = email.split("@")[0];

  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs text-content-muted uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
          {greeting}, {name}.
        </h1>
      </div>

      {renewalDate && (
        <div className="hidden text-right sm:block">
          <p className="text-xs text-content-muted">{renewalLabel}</p>
          <Link
            href="/account"
            className="text-sm text-content-secondary hover:text-content-primary transition-colors"
          >
            {renewalDate}
          </Link>
        </div>
      )}
    </div>
  );
}
