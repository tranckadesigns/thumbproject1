"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Stage = "exchanging" | "form" | "success" | "error";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("exchanging");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Exchange the code from the URL for a session
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setErrorMsg("Invalid or expired reset link. Please request a new one.");
      setStage("error");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStage("form"); // demo mode
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setErrorMsg("This link has expired or already been used. Please request a new one.");
        setStage("error");
      } else {
        setStage("form");
      }
    });
  }, [searchParams]);

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
      setStage("success");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setIsPending(false);
    } else {
      setStage("success");
      setTimeout(() => router.push("/library"), 2000);
    }
  }

  if (stage === "exchanging") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-content-muted" />
        <p className="text-sm text-content-muted">Verifying your link…</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
          <AlertCircle className="h-5 w-5 text-error" />
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">Link invalid</p>
          <p className="mt-1 text-sm text-content-muted">{errorMsg}</p>
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
    </form>
  );
}
