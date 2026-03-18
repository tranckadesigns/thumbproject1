/**
 * PSDfuel — Asset Upload Script
 *
 * Leest alle klare assets uit ../psdfuel-assets/_ready/, uploadt bestanden
 * naar Supabase Storage, categoriseert automatisch via Claude API,
 * en maakt records aan in de database.
 *
 * Gebruik:
 *   npm run upload-assets
 *
 * Vereiste env vars in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY           ← voor automatische categorisatie
 *
 * Asset mapstructuur (in ../psdfuel-assets/_ready/<slug>/):
 *   meta.json     ← title, short_description, full_description, tags, style_type, etc.
 *   preview.png   ← thumbnail afbeelding
 *   <slug>.psd    ← het PSD bestand
 *
 * meta.json heeft GEEN category veld meer — dat wordt automatisch bepaald.
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, rename, mkdir, rm } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve } from "path";
import {
  BROAD_CATEGORIES,
  getNiches,
  findOrCreateNiches,
  getBroadCategoryId,
  assignCategories,
} from "./lib/auto-categorize.mjs";

// ─── Config ───────────────────────────────────────────────────────────────────

const DONE_DIR     = resolve("../psdfuel-assets/_ready");
const UPLOADED_DIR = resolve("../psdfuel-assets/_uploaded");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  Zet NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("⚠️  ANTHROPIC_API_KEY niet gevonden — keyword-fallback wordt gebruikt voor categorisatie");
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function uploadFile(bucket, storagePath, localPath, contentType) {
  const file = await readFile(localPath);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, { contentType, upsert: true });
  if (error) throw new Error(`Upload mislukt (${storagePath}): ${error.message}`);
}

function getPublicUrl(bucket, storagePath) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const folders = await readdir(DONE_DIR, { withFileTypes: true });
  const assets = folders.filter((f) => f.isDirectory());

  if (assets.length === 0) {
    console.log("Geen assets gevonden in _ready/");
    return;
  }

  console.log(`\n${assets.length} asset(s) gevonden\n`);
  let success = 0;
  let skipped = 0;

  for (const folder of assets) {
    const slug = folder.name;
    const dir = join(DONE_DIR, slug);

    const metaPath    = join(dir, "meta.json");
    const previewPath = join(dir, "preview.png");
    const psdPath     = join(dir, `${slug}.psd`);

    // ── Validatie ─────────────────────────────────────────────────────────────
    const missing = [metaPath, previewPath, psdPath].filter((p) => !existsSync(p));
    if (missing.length > 0) {
      console.log(`⚠️  ${slug} — overgeslagen (ontbreekt: ${missing.map((p) => p.split(/[\\/]/).pop()).join(", ")})`);
      skipped++;
      continue;
    }

    const meta = JSON.parse(await readFile(metaPath, "utf8"));
    console.log(`⬆️  ${slug}`);

    try {
      // ── Categorisatie ─────────────────────────────────────────────────────
      // Primary: use vision-AI category from meta.json (most accurate — sees the image).
      // Fallback to "Growth" if missing or invalid.
      const metaCategory = meta.category;
      const primary = BROAD_CATEGORIES.includes(metaCategory) ? metaCategory : "Growth";
      if (!BROAD_CATEGORIES.includes(metaCategory)) {
        console.log(`   ⚠️  meta.json category '${metaCategory}' is onbekend — fallback naar 'Growth'`);
      }

      // Niches: determined by text AI (title + description + tags).
      const niches = await getNiches(
        meta.title ?? slug,
        meta.short_description ?? "",
        meta.tags ?? []
      );
      console.log(`   🏷  Primair: ${primary}${niches.length ? ` | Niches: ${niches.join(", ")}` : ""}`);

      // ── Haal broad category ID op ─────────────────────────────────────────
      const primaryId = await getBroadCategoryId(supabase, primary);
      if (!primaryId) throw new Error(`Broad category '${primary}' niet gevonden in DB — voer eerst migration 002 uit`);

      // ── Maak niche-categorieën aan indien nodig ───────────────────────────
      const nicheMap = await findOrCreateNiches(supabase, niches);
      const nicheIds = Object.values(nicheMap);

      // ── Upload preview.png → thumbnails bucket ────────────────────────────
      const previewStoragePath = `${slug}/preview.png`;
      await uploadFile("thumbnails", previewStoragePath, previewPath, "image/png");
      const thumbnailUrl = getPublicUrl("thumbnails", previewStoragePath);

      // ── Upload PSD → psds bucket ──────────────────────────────────────────
      const psdStoragePath = `${slug}.psd`;
      await uploadFile("psds", psdStoragePath, psdPath, "application/octet-stream");

      // ── Upsert asset record ───────────────────────────────────────────────
      // category kolom = naam van de primaire categorie (backwards-compat)
      const { data: asset, error: assetError } = await supabase
        .from("assets")
        .upsert({
          slug,
          title:             meta.title             ?? slug,
          short_description: meta.short_description ?? "",
          full_description:  meta.full_description  ?? "",
          category:          primary,
          style_type:        meta.style_type        ?? "Dark",
          thumbnail_url:     thumbnailUrl,
          preview_images:    [],
          psd_file_key:      psdStoragePath,
          file_size_mb:      meta.file_size_mb      ?? 0,
          version:           meta.version           ?? "1.0",
          is_featured:       meta.is_featured       ?? false,
          is_published:      meta.is_published      ?? true,
          tags:              meta.tags              ?? [],
        }, { onConflict: "slug" })
        .select("id")
        .single();

      if (assetError) throw new Error(assetError.message);

      // ── Schrijf asset_categories junction records ─────────────────────────
      await assignCategories(supabase, asset.id, primaryId, nicheIds);

      // ── Verplaats naar _uploaded/ ─────────────────────────────────────────
      if (!existsSync(dir)) {
        console.log(`   ↩  Map al verplaatst door een eerdere run — overgeslagen`);
        success++;
        continue;
      }
      await mkdir(UPLOADED_DIR, { recursive: true });
      const dest = join(UPLOADED_DIR, slug);
      if (existsSync(dest)) await rm(dest, { recursive: true, force: true });
      await rename(dir, dest);

      console.log(`   ✅  klaar — ${thumbnailUrl}`);
      success++;

    } catch (err) {
      console.error(`   ❌  ${err.message}`);
    }
  }

  console.log(`\nKlaar: ${success} geüpload, ${skipped} overgeslagen.\n`);
}

run();
