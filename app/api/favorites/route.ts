import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// GET — return all favorited asset IDs for current user
export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ ids: [] });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ids: [] });

  const { data } = await supabase
    .from("favorites")
    .select("asset_id")
    .eq("user_id", user.id);

  return NextResponse.json({ ids: (data ?? []).map((r: { asset_id: string }) => r.asset_id) });
}

// POST — add favorite { assetId }
export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 400 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { assetId } = await request.json();
  if (!assetId) return NextResponse.json({ error: "Missing assetId" }, { status: 400 });

  await supabase.from("favorites").upsert(
    { user_id: user.id, asset_id: assetId },
    { onConflict: "user_id,asset_id" }
  );

  return NextResponse.json({ ok: true });
}

// DELETE — remove favorite ?assetId=xxx
export async function DELETE(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Not configured" }, { status: 400 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assetId = request.nextUrl.searchParams.get("assetId");
  if (!assetId) return NextResponse.json({ error: "Missing assetId" }, { status: 400 });

  await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("asset_id", assetId);

  return NextResponse.json({ ok: true });
}
