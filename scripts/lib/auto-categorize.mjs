/**
 * PSDfuel — Auto-categorization
 *
 * Bepaalt automatisch de primaire categorie (broad) en niche-categorieën
 * voor een asset op basis van titel, beschrijving en tags.
 *
 * Primaire strategie: Claude API (gestructureerde JSON output)
 * Fallback:          keyword-matching (werkt offline, zonder API)
 */

import Anthropic from "@anthropic-ai/sdk";

// ─── Vaste brede categorieën ──────────────────────────────────────────────────

export const BROAD_CATEGORIES = [
  "Revenue",
  "Subscribers",
  "Growth",
  "Alerts",
  "Social",
  "E-Commerce",
  "Analytics",
  "Challenges",
  "Comparisons",
  "Ratings",
  "Timers",
  "Reactions",
];

// ─── Keyword fallback map ─────────────────────────────────────────────────────

const KEYWORD_MAP = {
  Revenue:     ["revenue", "earning", "income", "payout", "profit", "money", "dollar", "payment",
                "stripe", "paypal", "adsense", "cash", "salary", "wage", "financial", "finance",
                "trading", "crypto", "stock", "invest", "forex", "bitcoin"],
  Subscribers: ["subscriber", "sub count", "follow", "milestone", "fan", "audience", "member"],
  Growth:      ["growth", "view", "chart", "performance", "channel", "viral", "trending", "reach",
                "impression", "traffic", "spike", "boost"],
  Alerts:      ["alert", "warning", "notification", "breaking", "urgent", "important", "news",
                "update", "announce", "live"],
  Social:      ["instagram", "twitter", "tiktok", "facebook", "youtube", "linkedin", "reddit",
                "social", "post", "viral", "reel", "story", "tweet"],
  "E-Commerce":["shop", "store", "sale", "product", "order", "ecommerce", "shopify", "amazon",
                "purchase", "buy", "cart", "checkout", "course", "enrollment"],
  Analytics:   ["analytics", "ctr", "watch time", "metric", "data", "stat", "rate", "impression",
                "conversion", "funnel", "report", "dashboard"],
  Challenges:  ["challenge", "streak", "progress", "day", "tracker", "goal", "habit", "workout",
                "30 day", "100 day"],
  Comparisons: ["vs", "versus", "compare", "before", "after", "old", "new", "best", "worst",
                "then", "now", "difference"],
  Ratings:     ["rating", "star", "score", "review", "rank", "grade", "point", "badge", "award"],
  Timers:      ["timer", "countdown", "clock", "deadline", "launch", "event", "live", "go live"],
  Reactions:   ["reaction", "poll", "vote", "emoji", "comment", "response", "community", "chat"],
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Keyword fallback ─────────────────────────────────────────────────────────

function keywordFallback(title, description, tags) {
  const text = [title, description, ...tags].join(" ").toLowerCase();
  let best = "Growth";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(KEYWORD_MAP)) {
    const score = keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }

  return { primary: best, niches: [] };
}

// ─── Claude API ───────────────────────────────────────────────────────────────

async function claudeCategorize(title, description, tags) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });

  const prompt = `You are a categorization engine for PSDfuel, a premium PSD asset library for YouTube thumbnail designers.

Given an asset's metadata, return a JSON object with:
- "primary": exactly one name from BROAD_CATEGORIES (copy it exactly as written)
- "niches": array of specific niche category names this asset belongs to (can be new, can be empty)

BROAD_CATEGORIES: ${BROAD_CATEGORIES.join(", ")}

Rules:
- "primary" MUST be one of the broad categories listed above, copied exactly
- "niches" are specific sub-topics (e.g. "Trading", "PayPal", "Crypto", "Forex", "Shopify")
- Only add niches that are genuinely specific and useful as a filter label
- Return valid JSON only, nothing else

Asset:
Title: ${title}
Description: ${description || "(none)"}
Tags: ${tags.length ? tags.join(", ") : "(none)"}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text.trim();
    const json = JSON.parse(text);

    // Validate primary is a known broad category
    if (!BROAD_CATEGORIES.includes(json.primary)) {
      return null;
    }

    return {
      primary: json.primary,
      niches: Array.isArray(json.niches)
        ? json.niches.filter((n) => typeof n === "string" && n.trim().length > 0)
        : [],
    };
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Bepaalt de categorieën voor een asset.
 * Geeft altijd terug: { primary: string, niches: string[] }
 */
export async function categorizeAsset(title, description, tags = []) {
  const claudeResult = await claudeCategorize(title, description, tags);
  if (claudeResult) return claudeResult;

  console.log("   ↩  Claude niet beschikbaar — keyword-fallback gebruikt");
  return keywordFallback(title, description, tags);
}

/**
 * Zorgt dat alle niche-categorieën bestaan in de DB.
 * Maakt ze aan als ze er nog niet zijn (ON CONFLICT DO NOTHING).
 * Geeft een map terug: name → id
 */
export async function findOrCreateNiches(supabase, niches) {
  const result = {};
  for (const name of niches) {
    const slug = slugify(name);

    // Probeer eerst op te halen
    const { data: existing } = await supabase
      .from("categories")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (existing) {
      result[name] = existing.id;
      continue;
    }

    // Aanmaken
    const { data: created, error } = await supabase
      .from("categories")
      .insert({ slug, name, type: "niche", is_auto_created: true })
      .select("id")
      .single();

    if (error) {
      // Race condition: probeer nogmaals op te halen
      const { data: retry } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();
      if (retry) result[name] = retry.id;
    } else {
      result[name] = created.id;
    }
  }
  return result;
}

/**
 * Haalt het ID op van een broad category op basis van naam.
 */
export async function getBroadCategoryId(supabase, name) {
  const { data } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .eq("type", "broad")
    .single();
  return data?.id ?? null;
}

/**
 * Schrijft asset_categories records voor een asset.
 * Verwijdert eerst bestaande records (voor upsert-gedrag).
 */
export async function assignCategories(supabase, assetId, primaryId, nicheIds) {
  // Verwijder bestaande toewijzingen
  await supabase.from("asset_categories").delete().eq("asset_id", assetId);

  const records = [
    { asset_id: assetId, category_id: primaryId, is_primary: true },
    ...nicheIds.map((id) => ({ asset_id: assetId, category_id: id, is_primary: false })),
  ];

  const { error } = await supabase.from("asset_categories").insert(records);
  if (error) throw new Error(`assignCategories mislukt: ${error.message}`);
}
