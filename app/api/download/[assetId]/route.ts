import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import JSZip from "jszip";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { assetService } from "@/lib/services/index";
import { hasActiveSubscription } from "@/lib/subscription";

// Allow up to 60s — large PSDs need time to stream through
export const maxDuration = 60;

function buildLicense(assetTitle: string, userId: string, downloadedAt: string): string {
  return `PSDfuel Asset License
=====================

Asset:           ${assetTitle}
Licensed to:     Member ${userId}
Download date:   ${downloadedAt}
Source:          PSDfuel (psdfuel.com)
Owner:           Trancka, Kennedylaan 51, 5571 KB Bergeijk, Netherlands

© PSDfuel / Trancka. All rights reserved.

This file is licensed for personal and commercial use by the registered
member identified above. This license is non-transferable.

YOU MAY:
  • Use in your own YouTube thumbnails, videos, and client work
  • Modify, adapt, and build upon the design
  • Use in paid projects, sponsored content, and client deliverables

YOU MAY NOT:
  • Resell, redistribute, or sublicense this file or any derivative
  • Include in any asset library, template pack, or competing product
  • Share your account credentials or downloaded files with others
  • Remove or alter this license file

Violation of these terms will result in immediate account termination
and may result in legal action.

Full terms of service: psdfuel.com/terms
`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;

  // Auth gate
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Subscription gate
  const subscribed = await hasActiveSubscription();
  if (!subscribed) {
    return NextResponse.json({ error: "Subscription required" }, { status: 403 });
  }

  // Resolve asset
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

  // Short-lived signed URL to fetch the PSD server-side
  const { data: signedData, error: signedError } = await sb.storage
    .from("psds")
    .createSignedUrl(asset.psd_file_key, 120);

  if (signedError || !signedData?.signedUrl) {
    return NextResponse.json({ error: "Could not access file." }, { status: 500 });
  }

  // Download PSD into memory
  const psdResponse = await fetch(signedData.signedUrl);
  if (!psdResponse.ok) {
    return NextResponse.json({ error: "File download failed." }, { status: 500 });
  }
  const psdBuffer = await psdResponse.arrayBuffer();

  // Build ZIP: PSD + LICENSE.txt
  const downloadedAt = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const zip = new JSZip();
  const folderName = asset.title.replace(/[^a-z0-9 _-]/gi, "").trim() || asset.slug;
  zip.file(`${folderName}.psd`, psdBuffer);
  zip.file("LICENSE.txt", buildLicense(asset.title, user.id, downloadedAt));

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "STORE", // No compression — PSD is already binary, keeps it fast
  });

  // Log download (fire-and-forget)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;
  sb.from("downloads")
    .insert({ user_id: user.id, asset_id: asset.id, ip_address: ip, user_agent: userAgent })
    .then(({ error }) => { if (error) console.error("Download log failed:", error.message); });
  sb.rpc("increment_download_count", { asset_id: asset.id })
    .then(({ error }) => { if (error) console.error("Download count increment failed:", error.message); });

  // Stream ZIP to client
  const safeTitle = asset.title.replace(/[^a-z0-9 _-]/gi, "").trim() || asset.slug;
  return new Response(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeTitle}.zip"`,
      "Content-Length": String(zipBuffer.length),
    },
  });
}
