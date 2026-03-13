import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { assetService } from "@/lib/services/index";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;

  // Auth gate — require a valid session
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Resolve asset — try by ID, then by slug
  const asset =
    (await assetService.getLibrary().then((all) =>
      all.find((a) => a.id === assetId)
    )) ?? (await assetService.getAsset(assetId));

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  // Return a placeholder file.
  // In Phase 8, resolve asset.psd_file_key to a signed storage URL and redirect.
  const content = [
    `Vaulted — ${asset.title}`,
    ``,
    `File key: ${asset.psd_file_key}`,
    `Version:  ${asset.version}`,
    `Category: ${asset.category}`,
    ``,
    `This is a placeholder file.`,
    `The fully layered PSD will be delivered from cloud storage at launch.`,
    ``,
    `Downloaded by: ${user.email}`,
    `Downloaded at: ${new Date().toISOString()}`,
  ].join("\n");

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${asset.slug}.psd"`,
    },
  });
}
