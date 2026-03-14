"use client";

import { useSearchParams } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  otp_expired:    "This link has expired. Please request a new password reset.",
  access_denied:  "This link is invalid or has already been used.",
};

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error_code");
  const [dismissed, setDismissed] = useState(false);

  if (!errorCode || dismissed) return null;

  const message = ERROR_MESSAGES[errorCode] ?? "Something went wrong. Please try again.";

  return (
    <div className="border-b border-error/20 bg-error/5 px-6 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-error" />
          <p className="text-sm text-error">
            {message}{" "}
            {errorCode === "otp_expired" && (
              <a href="/forgot-password" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
                Request a new link →
              </a>
            )}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-error/60 hover:text-error transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
