import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { assetService } from "@/lib/services/index";
import type { AssetCategory, PlatformType, StyleType } from "@/types/asset";

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

export async function POST(request: NextRequest) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fd = await request.formData();

  const title = (fd.get("title") as string)?.trim();
  const slug = (fd.get("slug") as string)?.trim();
  const short_description = (fd.get("short_description") as string)?.trim() ?? "";
  const full_description = (fd.get("full_description") as string)?.trim() ?? "";
  const category = fd.get("category") as AssetCategory;
  const platform_type = fd.get("platform_type") as PlatformType;
  const style_type = fd.get("style_type") as StyleType;
  const tagsRaw = (fd.get("tags") as string) ?? "";
  const version = (fd.get("version") as string) ?? "1.0";
  const is_published = fd.get("is_published") === "true";
  const is_featured = fd.get("is_featured") === "true";

  if (!title || !slug || !category) {
    return NextResponse.json(
      { error: "title, slug, and category are required" },
      { status: 400 }
    );
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Upload thumbnail
  let thumbnail_url = "";
  const thumbnailFile = fd.get("thumbnail") as File | null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const ext = thumbnailFile.name.split(".").pop() ?? "jpg";
    thumbnail_url = await uploadFile("thumbnails", `${slug}.${ext}`, thumbnailFile);
  }

  // Upload PSD
  let psd_file_key = "";
  let file_size_mb = 0;
  const psdFile = fd.get("psd") as File | null;
  if (psdFile && psdFile.size > 0) {
    const path = `${category.toLowerCase().replace(/[^a-z0-9]/g, "-")}/${slug}.psd`;
    psd_file_key = await uploadFile("psds", path, psdFile);
    file_size_mb = parseFloat((psdFile.size / (1024 * 1024)).toFixed(1));
  }

  const asset = await assetService.createAsset({
    title,
    slug,
    short_description,
    full_description,
    category,
    platform_type,
    style_type,
    thumbnail_url,
    preview_images: [],
    psd_file_key,
    file_size_mb,
    version,
    is_published,
    is_featured,
    tags,
  });

  return NextResponse.json({ asset }, { status: 201 });
}
