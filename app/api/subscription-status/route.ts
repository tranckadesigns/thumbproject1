import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ active: true }); // demo mode

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ active: false });

  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .single();

  const active = data?.status === "active" || data?.status === "trialing";
  return NextResponse.json({ active });
}
