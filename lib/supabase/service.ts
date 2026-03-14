import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security.
 * Only use in server-side code (API routes, webhooks).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
