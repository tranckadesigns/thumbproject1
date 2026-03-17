import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan");

  const rawNext = searchParams.get("next") ?? "/library";
  // Validate next to prevent open redirect — must resolve to the same origin
  let next = "/library";
  try {
    const resolved = new URL(rawNext, origin);
    if (resolved.origin === origin) next = resolved.pathname + resolved.search;
  } catch {
    // Invalid URL — keep default
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.redirect(`${origin}/login?error=auth_not_configured`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/forgot-password?error=link_expired`);
  }

  // If a plan was carried through the signup flow, send to pricing with it pre-selected
  if (plan === "yearly" || plan === "monthly") {
    return NextResponse.redirect(`${origin}/pricing?plan=${plan}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
