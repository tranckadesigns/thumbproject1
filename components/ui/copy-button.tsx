"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  url: string;
  className?: string;
}

export function CopyButton({ url, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy link"
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150",
        copied
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
          : "border-border bg-base-elevated text-content-muted hover:border-border-strong hover:text-content-primary",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
    </button>
  );
}
