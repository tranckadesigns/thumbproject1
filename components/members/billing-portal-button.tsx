"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to open portal");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-border bg-base-elevated px-4 py-2 text-sm text-content-secondary hover:border-border-strong hover:text-content-primary transition-colors disabled:opacity-50"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {loading ? "Opening…" : "Manage billing"}
      </button>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
