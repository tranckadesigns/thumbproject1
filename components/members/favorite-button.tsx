"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { showToast } from "@/components/ui/toast";

interface FavoriteButtonProps {
  assetId: string;
  initialFavorited?: boolean;
  alwaysVisible?: boolean;
  size?: "sm" | "md";
}

export function FavoriteButton({ assetId, initialFavorited = false, alwaysVisible = false, size = "sm" }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const next = !favorited;
    setFavorited(next); // optimistic

    try {
      const res = next
        ? await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assetId }),
          })
        : await fetch(`/api/favorites?assetId=${assetId}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed");
      showToast(next ? "Added to favorites" : "Removed from favorites", "success");
    } catch {
      setFavorited(!next); // revert on error
      showToast("Couldn't update favorites — try again", "error");
    } finally {
      setLoading(false);
    }
  }

  const sizeClass = size === "md" ? "h-9 w-9" : "h-7 w-7";
  const iconClass = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <button
      onClick={toggle}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex items-center justify-center rounded-full border transition-all duration-150",
        sizeClass,
        favorited
          ? "border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25"
          : alwaysVisible
          ? "border-border bg-base-elevated text-content-muted hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
          : "border-border bg-black/40 text-content-muted opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:border-border-strong hover:text-content-primary",
        loading && "pointer-events-none opacity-50"
      )}
    >
      {loading ? (
        <Loader2 className={cn(iconClass, "animate-spin")} />
      ) : (
        <Heart className={cn(iconClass, favorited && "fill-current")} />
      )}
    </button>
  );
}
