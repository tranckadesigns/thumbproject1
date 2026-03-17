"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction, type AuthFormState } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthFormState = { error: null };

interface SignupFormProps {
  plan?: string;
}

export function SignupForm({ plan }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden plan field — preserved through signup → verify → checkout */}
      {plan && <input type="hidden" name="plan" value={plan} />}

      <div className="space-y-1.5">
        <Label htmlFor="display_name">
          Display name <span className="text-content-muted font-normal">(optional)</span>
        </Label>
        <Input
          id="display_name"
          name="display_name"
          type="text"
          autoComplete="name"
          placeholder="Your name or username"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
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

      {state.error && (
        <p className="rounded-lg border border-error/20 bg-error/10 px-3 py-2.5 text-sm text-error">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isPending}>
        {isPending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-content-muted">
        Already a member?{" "}
        <Link href="/login" className="text-content-secondary hover:text-content-primary transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
