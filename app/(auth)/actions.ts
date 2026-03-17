"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
};

// Map raw Supabase error messages to user-friendly copy
function friendlyError(raw: string): string {
  const msg = raw.toLowerCase();
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("user already registered") || msg.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (msg.includes("password should be at least") || msg.includes("password must be")) {
    return "Password must be at least 6 characters.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  return raw;
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { error: "Authentication is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: friendlyError(error.message) };
  }

  redirect("/library");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;
  const plan = (formData.get("plan") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return { error: "Authentication is not configured." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psdfuel.com";
  const callbackUrl = plan
    ? `${siteUrl}/auth/callback?plan=${plan}`
    : `${siteUrl}/auth/callback`;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    return { error: friendlyError(error.message) };
  }

  // Preserve plan selection through email verification flow
  const checkEmailUrl = plan ? `/check-email?plan=${plan}` : "/check-email";
  redirect(checkEmailUrl);
}

export type UpdateDisplayNameState = { error: string | null; success: boolean };

export async function updateDisplayNameAction(
  _prevState: UpdateDisplayNameState,
  formData: FormData
): Promise<UpdateDisplayNameState> {
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Not configured.", success: false };

  const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
  if (error) return { error: friendlyError(error.message), success: false };
  return { error: null, success: true };
}

export type ForgotPasswordState = {
  error: string | null;
  success: boolean;
};

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Auth not configured.", success: false };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://psdfuel.com";

  // Always return success to avoid leaking whether an email exists
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return { error: null, success: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}
