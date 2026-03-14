"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  assetId: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ assetId, initialFavorited = false }: FavoriteButtonProps) {
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
      if (next) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetId }),
        });
      } else {
        await fetch(`/api/favorites?assetId=${assetId}`, { method: "DELETE" });
      }
    } catch {
      setFavorited(!next); // revert on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-150",
        favorited
          ? "border-red-500/40 bg-red-500/15 text-red-400 hover:bg-red-500/25"
          : "border-border bg-black/40 text-content-muted opacity-0 group-hover:opacity-100 hover:border-border-strong hover:text-content-primary",
        loading && "pointer-events-none opacity-50"
      )}
    >
      <Heart className={cn("h-3.5 w-3.5", favorited && "fill-current")} />
    </button>
  );
}
