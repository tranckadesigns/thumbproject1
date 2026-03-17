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

  // If a real PSD is stored in Supabase Storage, return a signed URL as JSON
  // (client creates anchor tag — avoids loading entire file into browser memory)
  if (asset.psd_file_key) {
    const sb = getSupabaseServiceClient();
    const { data, error } = await sb.storage
      .from("psds")
      .createSignedUrl(asset.psd_file_key, 300); // 5 minutes — enough for slow connections

    if (!error && data?.signedUrl) {
      // Log the download and increment counter (both fire-and-forget)
      sb.from("downloads")
        .insert({ user_id: user.id, asset_id: asset.id })
        .then(() => null);
      sb.rpc("increment_download_count", { asset_id: asset.id })
        .then(() => null);

      // Stream the file through our own domain so the browser's native
      // download works without opening a new tab (cross-origin URLs ignore
      // the `download` attribute).
      const fileRes = await fetch(data.signedUrl);
      if (!fileRes.ok) {
        return NextResponse.json({ error: "File fetch failed" }, { status: 502 });
      }

      const filename = `${asset.title}.psd`;
      const headers = new Headers({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      });
      const contentLength = fileRes.headers.get("Content-Length");
      if (contentLength) headers.set("Content-Length", contentLength);

      return new NextResponse(fileRes.body, { headers });
    }
  }

  // Fallback — no PSD file attached yet
  return NextResponse.json(
    { error: "No file available for this asset yet — check back soon." },
    { status: 404 }
  );
}
