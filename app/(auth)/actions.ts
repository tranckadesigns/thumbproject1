"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
};

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    // Supabase not configured — pass through for local demo.
    redirect("/library");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/library");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/check-email");
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
  if (error) return { error: error.message, success: false };
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
