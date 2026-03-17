---

## 7. lib/repositories/supabase-asset-repository.ts

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Asset, AssetCategory } from "@/types/asset";
import type { IAssetRepository, AssetFilters } from "./asset-repository";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export class SupabaseAssetRepository implements IAssetRepository {
  async getAll(filters?: AssetFilters): Promise<Asset[]> {
    const sb = getClient();
    let q = sb.from("assets").select("*").eq("is_published", true);

    if (filters?.category) q = q.eq("category", filters.category);
    if (filters?.featured) q = q.eq("is_featured", true);
    if (filters?.search) {
      const term = `%${filters.search}%`;
      q = q.or(`title.ilike.${term},short_description.ilike.${term}`);
    }

    q = q.order("created_at", { ascending: false });
    const { data, error } = await q;
    if (error) throw new Error(`getAll failed: ${error.message}`);
    return data ?? [];
  }

  async getAllAdmin(): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getAllAdmin failed: ${error.message}`);
    return data ?? [];
  }

  async getBySlug(slug: string): Promise<Asset | null> {
    const sb = getClient();
    const { data } = await sb
      .from("assets")
      .select("*")
      .eq("slug", slug)
      .single();
    return data ?? null;
  }

  async getById(id: string): Promise<Asset | null> {
    const sb = getClient();
    const { data } = await sb
      .from("assets")
      .select("*")
      .eq("id", id)
      .single();
    return data ?? null;
  }

  async getFeatured(): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .eq("is_featured", true)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getFeatured failed: ${error.message}`);
    return data ?? [];
  }

  async getRecent(limit: number): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .eq("is_published", true)
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(`getRecent failed: ${error.message}`);
    return data ?? [];
  }

  async getByCategory(category: AssetCategory): Promise<Asset[]> {
    const sb = getClient();
    const { data, error } = await sb
      .from("assets")
      .select("*")
      .eq("category", category)
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(`getByCategory failed: ${error.message}`);
    return data ?? [];
  }

  async create(data: Omit<Asset, "id" | "created_at">): Promise<Asset> {
    const sb = getClient();
    const { data: created, error } = await sb
      .from("assets")
      .insert(data)
      .select()
      .single();
    if (error) throw new Error(`create failed: ${error.message}`);
    return created;
  }

  async update(
    id: string,
    data: Partial<Omit<Asset, "id" | "created_at">>
  ): Promise<Asset> {
    const sb = getClient();
    const { data: updated, error } = await sb
      .from("assets")
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(`update failed: ${error.message}`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const sb = getClient();
    const { error } = await sb.from("assets").delete().eq("id", id);
    if (error) throw new Error(`delete failed: ${error.message}`);
  }
}
```

---

## 8. lib/repositories/favorites-repository.ts

```typescript
export interface FavoriteEntry {
  id: string;
  user_id: string;
  asset_id: string;
  saved_at: string;
}

export interface IFavoritesRepository {
  getByUserId(userId: string): Promise<FavoriteEntry[]>;
  add(userId: string, assetId: string): Promise<FavoriteEntry>;
  remove(userId: string, assetId: string): Promise<void>;
  isFavorited(userId: string, assetId: string): Promise<boolean>;
}

// Mock implementation — in-memory, per session.
// Replace with Supabase adapter in Phase 8.
export class MockFavoritesRepository implements IFavoritesRepository {
  private favorites: FavoriteEntry[] = [];

  async getByUserId(userId: string): Promise<FavoriteEntry[]> {
    return this.favorites.filter((f) => f.user_id === userId);
  }

  async add(userId: string, assetId: string): Promise<FavoriteEntry> {
    const existing = this.favorites.find(
      (f) => f.user_id === userId && f.asset_id === assetId
    );
    if (existing) return existing;

    const entry: FavoriteEntry = {
      id: `fav-${Date.now()}`,
      user_id: userId,
      asset_id: assetId,
      saved_at: new Date().toISOString(),
    };
    this.favorites.push(entry);
    return entry;
  }

  async remove(userId: string, assetId: string): Promise<void> {
    this.favorites = this.favorites.filter(
      (f) => !(f.user_id === userId && f.asset_id === assetId)
    );
  }

  async isFavorited(userId: string, assetId: string): Promise<boolean> {
    return this.favorites.some(
      (f) => f.user_id === userId && f.asset_id === assetId
    );
  }
}
```

---

## 9. lib/repositories/downloads-repository.ts

```typescript
export interface DownloadEntry {
  id: string;
  user_id: string;
  asset_id: string;
  downloaded_at: string;
}

export interface IDownloadsRepository {
  getByUserId(userId: string): Promise<DownloadEntry[]>;
  log(userId: string, assetId: string): Promise<DownloadEntry>;
  hasDownloaded(userId: string, assetId: string): Promise<boolean>;
}

// Mock implementation — in-memory, per session.
// Replace with Supabase adapter in Phase 8.
export class MockDownloadsRepository implements IDownloadsRepository {
  private downloads: DownloadEntry[] = [];

  async getByUserId(userId: string): Promise<DownloadEntry[]> {
    return this.downloads.filter((d) => d.user_id === userId);
  }

  async log(userId: string, assetId: string): Promise<DownloadEntry> {
    const entry: DownloadEntry = {
      id: `dl-${Date.now()}`,
      user_id: userId,
      asset_id: assetId,
      downloaded_at: new Date().toISOString(),
    };
    this.downloads.push(entry);
    return entry;
  }

  async hasDownloaded(userId: string, assetId: string): Promise<boolean> {
    return this.downloads.some(
      (d) => d.user_id === userId && d.asset_id === assetId
    );
  }
}
```

---

## 10. lib/supabase/client.ts

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
```

---

## 11. lib/supabase/service.ts

```typescript
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security.
 * Only use in server-side code (API routes, webhooks).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
```

---

## 12. lib/supabase/server.ts

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — cookies are read-only here.
          // The middleware handles session refresh.
        }
      },
    },
  });
}
```

---

## 13. app/api/download/[assetId]/route.ts

```typescript
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

      const filename = `${asset.slug}.psd`;
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
```

---

## 14. app/api/webhooks/stripe/route.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { sendWelcomeEmail } from "@/lib/email/send-welcome";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// In Stripe API >= 2025-x, current_period_end moved to the item level
function getPeriodEnd(sub: any): string {
  const ts =
    sub.current_period_end ??
    sub.items?.data?.[0]?.current_period_end ??
    sub.billing_cycle_anchor;
  if (!ts) return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  return new Date(ts * 1000).toISOString();
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  try {
    switch (event.type) {
      // ── Checkout completed → subscription created ──────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as any;
        if (session.mode !== "subscription") break;

        const userId = session.metadata?.user_id;
        const planId = session.metadata?.plan_id;
        const subId  = session.subscription as string;
        const custId = session.customer as string;

        if (!userId || !subId) break;

        const sub = await stripe.subscriptions.retrieve(subId) as any;

        await upsertSubscription(supabase, {
          userId,
          stripeCustomerId:     custId,
          stripeSubscriptionId: subId,
          status:               sub.status,
          planId:               planId ?? null,
          currentPeriodEnd:     getPeriodEnd(sub),
          cancelAtPeriodEnd:    sub.cancel_at_period_end ?? false,
        });

        // Send welcome email
        const customerEmail = session.customer_details?.email ?? session.customer_email;
        if (customerEmail) {
          await sendWelcomeEmail({
            to: customerEmail,
            plan: (planId === "yearly" ? "yearly" : "monthly"),
          });
        }
        break;
      }

      // ── Subscription updated (renewal, plan change, cancel scheduled) ──────
      case "customer.subscription.updated": {
        const sub = event.data.object as any;