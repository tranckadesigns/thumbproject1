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

  // If a real PSD is stored in Supabase Storage, generate a signed URL and redirect
  if (asset.psd_file_key) {
    const sb = getSupabaseServiceClient();
    const { data, error } = await sb.storage
      .from("psds")
      .createSignedUrl(asset.psd_file_key, 60); // expires in 60 seconds

    if (!error && data?.signedUrl) {
      // Log the download
      await sb
        .from("downloads")
        .insert({ user_id: user.id, asset_id: asset.id })
        .then(() => null); // fire-and-forget

      return NextResponse.redirect(data.signedUrl);
    }
  }

  // Fallback — placeholder text file (no PSD uploaded yet)
  const content = [
    `PSDfuel — ${asset.title}`,
    ``,
    `This asset doesn't have a PSD file attached yet.`,
    `Check back soon.`,
    ``,
    `Downloaded by: ${user.email}`,
    `Downloaded at: ${new Date().toISOString()}`,
  ].join("\n");

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${asset.slug}.txt"`,
    },
  });
}
