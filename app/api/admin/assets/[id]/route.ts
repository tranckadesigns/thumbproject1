import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { assetService } from "@/lib/services/index";
import type { AssetCategory, StyleType } from "@/types/asset";

async function assertAdmin() {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!user) return false;
  if (adminEmail && user.email !== adminEmail) return false;
  return true;
}

async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const sb = getSupabaseServiceClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await sb.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  if (bucket === "thumbnails") {
    const { data } = sb.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
  return path;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const fd = await request.formData();

  const updates: Record<string, unknown> = {};

  const title = (fd.get("title") as string)?.trim();
  if (title) updates.title = title;

  const slug = (fd.get("slug") as string)?.trim();
  if (slug) updates.slug = slug;

  const short_description = fd.get("short_description") as string | null;
  if (short_description !== null) updates.short_description = short_description.trim();

  const full_description = fd.get("full_description") as string | null;
  if (full_description !== null) updates.full_description = full_description.trim();

  const category = fd.get("category") as AssetCategory | null;
  if (category) updates.category = category;

  const style_type = fd.get("style_type") as StyleType | null;
  if (style_type) updates.style_type = style_type;

  const tagsRaw = fd.get("tags") as string | null;
  if (tagsRaw !== null) {
    updates.tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
  }

  const version = fd.get("version") as string | null;
  if (version) updates.version = version;

  const isPublishedRaw = fd.get("is_published");
  if (isPublishedRaw !== null) updates.is_published = isPublishedRaw === "true";

  const isFeaturedRaw = fd.get("is_featured");
  if (isFeaturedRaw !== null) updates.is_featured = isFeaturedRaw === "true";

  // Replace thumbnail if provided
  const thumbnailFile = fd.get("thumbnail") as File | null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const currentSlug = (slug ?? (await assetService.getAssetById(id))?.slug) ?? id;
    const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
    updates.thumbnail_url = await uploadFile(
      "thumbnails",
      `${currentSlug}.${ext}`,
      thumbnailFile
    );
  }

  // Replace PSD if provided
  const psdFile = fd.get("psd") as File | null;
  if (psdFile && psdFile.size > 0) {
    const currentSlug = (slug ?? (await assetService.getAssetById(id))?.slug) ?? id;
    const cat = ((category ?? (await assetService.getAssetById(id))?.category) ?? "general")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const path = `${cat}/${currentSlug}.psd`;
    updates.psd_file_key = await uploadFile("psds", path, psdFile);
    updates.file_size_mb = parseFloat((psdFile.size / (1024 * 1024)).toFixed(1));
  }

  const asset = await assetService.updateAsset(id, updates);
  return NextResponse.json({ asset });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await assetService.deleteAsset(id);
  return NextResponse.json({ ok: true });
}
