import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { assetService } from "@/lib/services/index";
import { hasActiveSubscription } from "@/lib/subscription";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;

  // Auth gate — require active session
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Subscription gate — require active subscription
  const subscribed = await hasActiveSubscription();
  if (!subscribed) {
    return NextResponse.json({ error: "Subscription required" }, { status: 403 });
  }

  // Resolve asset by ID or slug
  const asset =
    (await assetService.getAssetById(assetId)) ??
    (await assetService.getAsset(assetId));

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  if (!asset.psd_file_key) {
    return NextResponse.json(
      { error: "No file available for this asset yet — check back soon." },
      { status: 404 }
    );
  }

  const sb = getSupabaseServiceClient();

  // Create a signed URL with download filename set — Supabase Storage returns
  // Content-Disposition: attachment, which triggers a download even cross-origin.
  const { data, error } = await sb.storage
    .from("psds")
    .createSignedUrl(asset.psd_file_key, 300, {
      download: `${asset.title}.psd`,
    });

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Could not generate download link." }, { status: 502 });
  }

  // Log the download and increment counter (fire-and-forget)
  sb.from("downloads")
    .insert({ user_id: user.id, asset_id: asset.id })
    .then(() => null);
  sb.rpc("increment_download_count", { asset_id: asset.id })
    .then(() => null);

  // Return signed URL — client opens it directly, no server-side file proxying
  return NextResponse.json({ url: data.signedUrl });
}
