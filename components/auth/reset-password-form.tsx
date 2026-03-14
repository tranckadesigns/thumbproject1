"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stage, setStage] = useState<"form" | "success">("form");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const completedRef = useRef(false);

  // When the user navigates away without completing the reset,
  // sign them out so they don't end up logged in with just the recovery session.
  useEffect(() => {
    return () => {
      if (!completedRef.current) {
        getSupabaseBrowserClient()?.auth.signOut();
      }
    };
  }, []);

  // /auth/callback forwards here with ?error=link_expired when the code is invalid
  if (searchParams.get("error") === "link_expired") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
          <AlertCircle className="h-5 w-5 text-error" />
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">Link expired</p>
          <p className="mt-1 text-sm text-content-muted">
            This link has expired or already been used.
          </p>
        </div>
        <a
          href="/forgot-password"
          className="mt-2 text-sm text-content-secondary hover:text-content-primary transition-colors"
        >
          Request a new link →
        </a>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">Password updated</p>
          <p className="mt-1 text-sm text-content-muted">Redirecting you to the library…</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setErrorMsg(null);
    setIsPending(true);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      completedRef.current = true;
      setStage("success");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setIsPending(false);
    } else {
      completedRef.current = true;
      setStage("success");
      setTimeout(() => router.push("/library"), 2000);
    }
  }

  async function handleCancel() {
    completedRef.current = true; // prevent the unmount effect from running
    await getSupabaseBrowserClient()?.auth.signOut();
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          minLength={6}
        />
        <p className="text-xs text-content-muted">At least 6 characters</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </div>

      {errorMsg && (
        <p className="rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error">
          {errorMsg}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Updating…" : "Set new password"}
      </Button>

      <button
        type="button"
        onClick={handleCancel}
        className="w-full text-center text-sm text-content-muted hover:text-content-secondary transition-colors"
      >
        Cancel
      </button>
    </form>
  );
}
