"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function FavoritesNavButton() {
  const pathname = usePathname();
  const isActive = pathname === "/favorites";

  return (
    <Link
      href="/favorites"
      aria-label="Favorites"
      className="group flex items-center justify-center"
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all duration-150",
          isActive
            ? "fill-red-400 text-red-400 scale-110"
            : "text-content-secondary group-hover:fill-red-400 group-hover:text-red-400 group-hover:scale-110"
        )}
      />
    </Link>
  );
}
