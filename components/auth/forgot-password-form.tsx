"use client";

import { useActionState } from "react";
import { CheckCircle } from "lucide-react";
import { forgotPasswordAction, type ForgotPasswordState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ForgotPasswordState = { error: null, success: false };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-5 w-5 text-success" />
        </div>
        <div>
          <p className="text-sm font-medium text-content-primary">Check your inbox</p>
          <p className="mt-1 text-sm text-content-muted">
            If an account exists for that email, you&apos;ll receive a reset link shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      {state.error && (
        <p className="rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
