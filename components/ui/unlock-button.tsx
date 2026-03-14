"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface UnlockButtonProps {
  href?: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function UnlockButton({
  href = "/pricing",
  label = "Unlock access",
  className,
  size = "md",
}: UnlockButtonProps) {
  const [hovered, setHovered] = useState(false);

  const base = cn(
    "inline-flex items-center gap-2 rounded-lg border border-border bg-base-elevated text-content-secondary transition-all hover:border-border-strong hover:text-content-primary",
    size === "sm" && "px-3 py-1.5 text-xs",
    size === "md" && "px-4 py-2.5 text-sm",
    className
  );

  const Icon = hovered ? LockOpen : Lock;

  return (
    <Link
      href={href}
      className={base}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon className={cn("flex-shrink-0 transition-transform", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", hovered && "scale-110")} />
      {label}
    </Link>
  );
}
