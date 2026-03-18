"use client";

import Link from "next/link";
import { X, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface UpgradeModalProps {
  onClose: () => void;
}

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-base-surface p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-base-overlay hover:text-content-primary"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10">
          <Zap className="h-5 w-5 text-accent" />
        </div>

        <h2 className="text-lg font-semibold tracking-tight text-content-primary">
          Unlock this asset
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-content-secondary">
          Get instant access to this file and every asset in the library — fully layered PSDs, ready to customize in minutes.
        </p>

        {/* Benefits */}
        <ul className="mt-4 space-y-2">
          {[
            "Full library access — all categories",
            "Unlimited downloads, no credits",
            "New assets added every month",
            "Cancel anytime",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-xs text-content-secondary">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/pricing"
            onClick={onClose}
            className={cn(buttonVariants({ size: "lg" }), "w-full btn-shine")}
          >
            Get access — from $30/mo
          </Link>
          <button
            onClick={onClose}
            className="text-xs text-content-muted transition-colors hover:text-content-secondary"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
