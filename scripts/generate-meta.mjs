/**
 * PSDfuel — Meta Generator (AI-powered)
 *
 * Scant _done/ en maakt een volledig ingevulde meta.json aan voor elke
 * asset die er nog geen heeft. Gebruikt Claude om de preview.png te
 * analyseren en alle velden automatisch in te vullen.
 *
 * Als een asset niet past in een bestaande categorie, maakt het script
 * automatisch een nieuwe categorie aan in categories.ts en types/asset.ts.
 *
 * Gebruik:
 *   node --env-file=.env.local scripts/generate-meta.mjs
 */

import Anthropic from "@anthropic-ai/sdk";
import { readdir, writeFile, readFile, stat } from "fs/promises";
import { existsSync } from "fs";
import { join, resolve } from "path";

const DONE_DIR      = resolve("../psdfuel-assets/_ready");
const CATEGORIES_TS = resolve("lib/config/categories.ts");
const ASSET_TYPE_TS = resolve("types/asset.ts");

const STYLE_TYPES = ["Dark", "Light", "Minimal", "Bold", "Neon", "Gradient"];

// ─── Lees huidige categorieën uit categories.ts ───────────────────────────────

async function readCategories() {
  const content = await readFile(CATEGORIES_TS, "utf8");
  const matches = [...content.matchAll(/\{\s*name:\s*"([^"]+)",\s*description:\s*"([^"]+)"\s*\}/g)];
  return matches.map(([, name, description]) => ({ name, description }));
}

// ─── Voeg nieuwe categorie toe aan categories.ts en types/asset.ts ────────────

async function addCategory(name, description) {
  // 1. Voeg toe aan categories.ts
  let cats = await readFile(CATEGORIES_TS, "utf8");
  const lastEntry = cats.lastIndexOf("},");
  const newEntry = `\n  { name: "${name}", description: "${description}" },`;
  cats = cats.slice(0, lastEntry + 2) + newEntry + cats.slice(lastEntry + 2);
  await writeFile(CATEGORIES_TS, cats);

  // 2. Herbouw de AssetCategory union volledig vanuit de bijgewerkte categories.ts
  //    (robust: werkt ook als er al eerder nieuwe categorieën zijn toegevoegd)
  const updated = await readCategories();
  const unionLines = updated.map((c) => `  | "${c.name}"`).join("\n");
  const newUnion = `export type AssetCategory =\n${unionLines};`;

  let types = await readFile(ASSET_TYPE_TS, "utf8");
  types = types.replace(/export type AssetCategory =[\s\S]*?;/, newUnion);
  await writeFile(ASSET_TYPE_TS, types);

  console.log(`   🆕  Nieuwe categorie aangemaakt: "${name}"`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugToTitle(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

async function getFileSizeMb(filePath) {
  try {
    const { size } = await stat(filePath);
    return parseFloat((size / (1024 * 1024)).toFixed(1));
  } catch {
    return 0;
  }
}

// ─── AI ───────────────────────────────────────────────────────────────────────

async function generateMetaWithAI(client, slug, previewPath, categories) {
  const imageData = await readFile(previewPath);
  const base64 = imageData.toString("base64");

  const categoryList = categories
    .map((c) => `  - "${c.name}": ${c.description}`)
    .join("\n");

  const prompt = `You are writing product copy for PSDfuel — a premium library of fully editable PSD overlay assets for YouTube thumbnail designers.

Every asset is a layered PSD file. The text, numbers, and colors in the preview are placeholder values the buyer replaces in Photoshop.

Look carefully at the image and identify:
1. The exact real-world platform or product it replicates (e.g. Etsy, Spotify, Stripe, Apple, Amazon, YouTube Studio, Google Analytics)
2. The exact UI element type (e.g. sales overview panel, revenue chart, now playing card, order summary, analytics dashboard, countdown timer)

Use both to write the title and descriptions — platform + UI type, specific and confident. Skip filler phrases. Do not describe placeholder values, colors, or individual sub-elements.

Asset slug: "${slug}"

EXISTING CATEGORIES (pick the single best fit):
${categoryList}

If none fit, suggest a new one.

Return this JSON:
{
  "title": "Max 4 words. Platform + UI type. (e.g. 'Etsy Sales Overview', 'Spotify Now Playing', 'Stripe Revenue Chart')",
  "short_description": "One sentence. What this overlay IS — platform and UI type. Max 12 words.",
  "full_description": "2 sentences. First: which platform UI this replicates and its visual style. Second: what thumbnail context it supports — no 'perfect for' or 'ideal for'.",
  "category": "Exact name from the list above, or a new name if truly needed",
  "new_category_description": "Only if category is new — one short sentence. Otherwise omit.",
  "style_type": "One of: Dark | Light | Minimal | Bold | Neon | Gradient",
  "tags": ["max 5 tags", "lowercase", "what a designer would search"]
}

Return ONLY the JSON object.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/png", data: base64 } },
          { type: "text", text: prompt },
        ],
      },
    ],
  });

  const text = response.content[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Geen geldig JSON in AI-response");
  return JSON.parse(jsonMatch[0]);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("❌  Zet ANTHROPIC_API_KEY in .env.local");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const folders = await readdir(DONE_DIR, { withFileTypes: true });
  const assets = folders.filter((f) => f.isDirectory());

  if (assets.length === 0) {
    console.log("Geen assets gevonden in _ready/");
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const folder of assets) {
    const slug = folder.name;
    const dir = join(DONE_DIR, slug);
    const metaPath = join(dir, "meta.json");

    if (existsSync(metaPath)) {
      console.log(`⏭  ${slug} — overgeslagen (meta.json bestaat al)`);
      skipped++;
      continue;
    }

    const previewPath = join(dir, "preview.png");
    if (!existsSync(previewPath)) {
      console.log(`⚠️  ${slug} — overgeslagen (geen preview.png)`);
      skipped++;
      continue;
    }

    console.log(`🤖  ${slug} — AI analyseert preview...`);

    try {
      // Lees huidige categorieën vers per asset (kan bijgewerkt zijn)
      const categories = await readCategories();
      const ai = await generateMetaWithAI(client, slug, previewPath, categories);

      // Nieuwe categorie toevoegen indien nodig
      const existingNames = categories.map((c) => c.name);
      if (!existingNames.includes(ai.category) && ai.new_category_description) {
        await addCategory(ai.category, ai.new_category_description);
      } else if (!existingNames.includes(ai.category)) {
        // Geen beschrijving meegestuurd — gebruik de categorie naam als fallback beschrijving
        await addCategory(ai.category, `${ai.category} overlays and UI elements`);
      }

      const fileSizeMb = await getFileSizeMb(join(dir, `${slug}.psd`));

      const meta = {
        slug,
        title:             ai.title             ?? slugToTitle(slug),
        short_description: ai.short_description ?? "",
        full_description:  ai.full_description  ?? "",
        category:          ai.category,
        style_type:        ai.style_type        ?? "Dark",
        tags:              ai.tags              ?? [],
        file_size_mb:      fileSizeMb,
        version:           "1.0",
        is_featured:       false,
        is_published:      true,
      };

      await writeFile(metaPath, JSON.stringify(meta, null, 2) + "\n");
      console.log(`   ✅  Klaar — category: ${meta.category}, style: ${meta.style_type}`);
      created++;

    } catch (err) {
      console.error(`   ❌  ${err.message}`);
    }
  }

  console.log(`\nKlaar: ${created} aangemaakt, ${skipped} overgeslagen.\n`);
}

run();
