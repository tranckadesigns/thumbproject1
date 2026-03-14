"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

interface CheckoutButtonProps {
  planId: "monthly" | "yearly";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);

    try {
      // Check if user is logged in
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Not logged in — go to signup first, then return to checkout
          router.push(`/signup?plan=${planId}`);
          return;
        }
      }

      // Create Stripe checkout session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) throw new Error("Checkout failed");

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(className)}
    >
      {loading ? "Redirecting…" : children}
    </button>
  );
}
