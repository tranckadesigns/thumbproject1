Perfect! I have successfully read all the requested files. Let me present them in a clearly labeled format for you:

---

## 1. supabase/schema.sql

```sql
-- ─────────────────────────────────────────────────────────────────────────────
-- PSDfuel — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- One row per user, auto-created on signup via trigger below.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
-- One row per user. Updated by Stripe webhook.
-- status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing'

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT        UNIQUE,
  stripe_subscription_id  TEXT        UNIQUE,
  status                  TEXT        NOT NULL DEFAULT 'inactive',
  plan_id                 TEXT,                          -- 'monthly' | 'yearly'
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ─── Downloads ────────────────────────────────────────────────────────────────
-- One row per download event.

CREATE TABLE IF NOT EXISTS public.downloads (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_id      TEXT        NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
  ON public.downloads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads"
  ON public.downloads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ─── Auto-create profile on signup ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Auto-update updated_at on subscriptions ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Assets ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.assets (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT          NOT NULL UNIQUE,
  title             TEXT          NOT NULL,
  short_description TEXT          NOT NULL DEFAULT '',
  full_description  TEXT          NOT NULL DEFAULT '',
  category          TEXT          NOT NULL,
  style_type        TEXT          NOT NULL DEFAULT 'Dark',
  thumbnail_url     TEXT          NOT NULL DEFAULT '',
  preview_images    TEXT[]        NOT NULL DEFAULT '{}',
  psd_file_key      TEXT          NOT NULL DEFAULT '',
  file_size_mb      NUMERIC(8,2)  NOT NULL DEFAULT 0,
  version           TEXT          NOT NULL DEFAULT '1.0',
  is_featured       BOOLEAN       NOT NULL DEFAULT FALSE,
  is_published      BOOLEAN       NOT NULL DEFAULT FALSE,
  tags              TEXT[]        NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS assets_category_idx   ON public.assets (category);
CREATE INDEX IF NOT EXISTS assets_published_idx  ON public.assets (is_published);
CREATE INDEX IF NOT EXISTS assets_featured_idx   ON public.assets (is_featured);
CREATE INDEX IF NOT EXISTS assets_created_at_idx ON public.assets (created_at DESC);

DROP TRIGGER IF EXISTS assets_updated_at ON public.assets;
CREATE TRIGGER assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

## 2. supabase/migrations/001_schema.sql

```sql
-- ─────────────────────────────────────────────────────────────────────────────
-- PSDfuel — Database Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Assets ───────────────────────────────────────────────────────────────────

create table if not exists public.assets (
  id               uuid        primary key default gen_random_uuid(),
  slug             text        unique not null,
  title            text        not null,
  short_description text       not null default '',
  full_description text        not null default '',
  category         text        not null,
  style_type       text        not null default 'Dark',
  thumbnail_url    text        not null default '',
  preview_images   text[]      not null default '{}',
  psd_file_key     text        not null default '',
  file_size_mb     numeric(8,2) not null default 0,
  version          text        not null default '1.0',
  is_featured      boolean     not null default false,
  is_published     boolean     not null default false,
  tags             text[]      not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ── Subscriptions ─────────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        unique not null references auth.users(id) on delete cascade,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  status                  text        not null default 'inactive',
  plan_id                 text,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean     not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ── Favorites ─────────────────────────────────────────────────────────────────

create table if not exists public.favorites (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  asset_id   uuid        not null references public.assets(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  unique(user_id, asset_id)
);

-- ── Downloads ─────────────────────────────────────────────────────────────────

create table if not exists public.downloads (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  asset_id      uuid        not null references public.assets(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists assets_category_idx    on public.assets(category);
create index if not exists assets_published_idx   on public.assets(is_published);
create index if not exists assets_featured_idx    on public.assets(is_featured);
create index if not exists assets_created_at_idx  on public.assets(created_at desc);
create index if not exists favorites_user_idx     on public.favorites(user_id);
create index if not exists downloads_user_idx     on public.downloads(user_id);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);

-- ── updated_at trigger ────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger assets_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

create or replace trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.assets        enable row level security;
alter table public.subscriptions enable row level security;
alter table public.favorites     enable row level security;
alter table public.downloads     enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "Published assets are publicly readable"  on public.assets;
drop policy if exists "Users can read own subscription"         on public.subscriptions;
drop policy if exists "Users can read own favorites"            on public.favorites;
drop policy if exists "Users can insert own favorites"          on public.favorites;
drop policy if exists "Users can delete own favorites"          on public.favorites;
drop policy if exists "Users can read own downloads"            on public.downloads;
drop policy if exists "Users can insert own downloads"          on public.downloads;

-- Assets: published assets are readable by everyone (including anon)
create policy "Published assets are publicly readable"
  on public.assets for select
  using (is_published = true);

-- Subscriptions: users can only read their own subscription
create policy "Users can read own subscription"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid());

-- Favorites: users can only access their own favorites
create policy "Users can read own favorites"
  on public.favorites for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own favorites"
  on public.favorites for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete own favorites"
  on public.favorites for delete
  to authenticated
  using (user_id = auth.uid());

-- Downloads: users can only access their own downloads
create policy "Users can read own downloads"
  on public.downloads for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own downloads"
  on public.downloads for insert
  to authenticated
  with check (user_id = auth.uid());
```

---

## 3. supabase/seed.sql

File shows extensive seed data with 39 assets across categories: Revenue, Subscribers, Growth, Alerts, Social, E-Commerce, Analytics, Challenges, Comparisons, Ratings, Timers, and Reactions. Each asset includes slug, title, descriptions, category, style_type, file references, and tags. (See read output for full content - 383 lines of INSERT statements)

---

## 4. lib/services/index.ts

```typescript
import { MockAssetRepository } from "@/lib/repositories/asset-repository";
import { SupabaseAssetRepository } from "@/lib/repositories/supabase-asset-repository";
import { MockDownloadsRepository } from "@/lib/repositories/downloads-repository";
import { MockFavoritesRepository } from "@/lib/repositories/favorites-repository";
import { AssetService } from "@/lib/services/asset-service";
import { DownloadsService } from "@/lib/services/downloads-service";
import { FavoritesService } from "@/lib/services/favorites-service";
import { mockAssets } from "@/lib/mock/mock-assets";

const useSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export const assetService = new AssetService(
  useSupabase
    ? new SupabaseAssetRepository()
    : new MockAssetRepository(mockAssets)
);

export const downloadsService = new DownloadsService(new MockDownloadsRepository());
export const favoritesService = new FavoritesService(new MockFavoritesRepository());
```

---

## 5. lib/services/stats-service.ts

```typescript
import { assetService } from "@/lib/services/index";
import { siteConfig } from "@/lib/config/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Starting offset — real subscribers are added on top of this
const CREATOR_OFFSET = 1229;

export interface LibraryStats {
  assetCount: number;
  categoryCount: number;
  creatorCount: number;
}

export async function getLibraryStats(): Promise<LibraryStats> {
  const [assets, creatorCount] = await Promise.all([
    assetService.getLibrary(),
    getCreatorCount(),
  ]);

  return {
    assetCount: assets.length,
    categoryCount: siteConfig.categories.length,
    creatorCount,
  };
}

async function getCreatorCount(): Promise<number> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return CREATOR_OFFSET;

  const { count } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .in("status", ["active", "trialing"]);

  const liveCount = count ?? 0;
  // Only add live count when meaningful — prevents display flickering
  // between e.g. 1229+ and 1230+ at low subscriber counts near launch
  return CREATOR_OFFSET + (liveCount >= 10 ? liveCount : 0);
}
```

---

## 6. lib/repositories/asset-repository.ts

```typescript
import type { Asset, AssetCategory } from "@/types/asset";

export interface AssetFilters {
  category?: AssetCategory;
  tags?: string[];
  search?: string;
  featured?: boolean;
}

export interface IAssetRepository {
  getAll(filters?: AssetFilters): Promise<Asset[]>;
  getAllAdmin(): Promise<Asset[]>;
  getBySlug(slug: string): Promise<Asset | null>;
  getById(id: string): Promise<Asset | null>;
  getFeatured(): Promise<Asset[]>;
  getRecent(limit: number): Promise<Asset[]>;
  getByCategory(category: AssetCategory): Promise<Asset[]>;
  create(data: Omit<Asset, "id" | "created_at">): Promise<Asset>;
  update(id: string, data: Partial<Omit<Asset, "id" | "created_at">>): Promise<Asset>;
  delete(id: string): Promise<void>;
}

// Mock implementation — replace with Supabase adapter in Phase 8.
export class MockAssetRepository implements IAssetRepository {
  private assets: Asset[];

  constructor(seed: Asset[] = []) {
    this.assets = seed;
  }

  async getAllAdmin(): Promise<Asset[]> {
    return [...this.assets].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async getAll(filters?: AssetFilters): Promise<Asset[]> {
    let results = this.assets.filter((a) => a.is_published);

    if (filters?.category) {
      results = results.filter((a) => a.category === filters.category);
    }
    if (filters?.featured) {
      results = results.filter((a) => a.is_featured);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.short_description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return results;
  }

  async getBySlug(slug: string): Promise<Asset | null> {
    return this.assets.find((a) => a.slug === slug) ?? null;
  }

  async getById(id: string): Promise<Asset | null> {
    return this.assets.find((a) => a.id === id) ?? null;
  }

  async getFeatured(): Promise<Asset[]> {
    return this.assets.filter((a) => a.is_featured && a.is_published);
  }

  async getRecent(limit: number): Promise<Asset[]> {
    return [...this.assets]
      .filter((a) => a.is_published)
      .sort((a, b) => new Date(b.updated_at ?? b.created_at).getTime() - new Date(a.updated_at ?? a.created_at).getTime())
      .slice(0, limit);
  }

  async getByCategory(category: AssetCategory): Promise<Asset[]> {
    return this.assets.filter(
      (a) => a.category === category && a.is_published
    );
  }

  async create(data: Omit<Asset, "id" | "created_at">): Promise<Asset> {
    const asset: Asset = {
      ...data,
      id: `asset-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.assets.push(asset);
    return asset;
  }

  async update(id: string, data: Partial<Omit<Asset, "id" | "created_at">>): Promise<Asset> {
    const idx = this.assets.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error(`Asset not found: ${id}`);
    this.assets[idx] = { ...this.assets[idx], ...data };
    return this.assets[idx];
  }

  async delete(id: string): Promise<void> {
    this.assets = this.assets.filter((a) => a.id !== id);
  }
}
```

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
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await upsertSubscription(supabase, {
          userId,
          stripeCustomerId:     sub.customer as string,
          stripeSubscriptionId: sub.id,
          status:               sub.status,
          planId:               sub.metadata?.plan_id ?? null,
          currentPeriodEnd:     getPeriodEnd(sub),
          cancelAtPeriodEnd:    sub.cancel_at_period_end ?? false,
        });
        break;
      }

      // ── Subscription canceled / deleted ────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await upsertSubscription(supabase, {
          userId,
          stripeCustomerId:     sub.customer as string,
          stripeSubscriptionId: sub.id,
          status:               "canceled",
          planId:               sub.metadata?.plan_id ?? null,
          currentPeriodEnd:     getPeriodEnd(sub),
          cancelAtPeriodEnd:    true,
        });
        break;
      }

      // ── Payment failed ─────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        if (!invoice.subscription) break;

        const sub = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        ) as any;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Webhook handler error:", message);
    return NextResponse.json({ error: "Handler failed", detail: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function upsertSubscription(
  supabase: any,
  data: {
    userId:               string;
    stripeCustomerId:     string;
    stripeSubscriptionId: string;
    status:               string;
    planId:               string | null;
    currentPeriodEnd:     string;
    cancelAtPeriodEnd:    boolean;
  }
) {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id:                data.userId,
      stripe_customer_id:     data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId,
      status:                 data.status,
      plan_id:                data.planId,
      current_period_end:     data.currentPeriodEnd,
      cancel_at_period_end:   data.cancelAtPeriodEnd,
      updated_at:             new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw new Error(`Supabase upsert failed: ${error.message}`);
}
```

---

## 15. app/(auth)/actions.ts

```typescript
"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string | null;
};

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    // Supabase not configured — pass through for local demo.
    redirect("/library");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/library");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/check-email");
}

export type UpdateDisplayNameState = { error: string | null; success: boolean };

export async function updateDisplayNameAction(
  _prevState: UpdateDisplayNameState,
  formData: FormData
): Promise<UpdateDisplayNameState> {
  const displayName = (formData.get("display_name") as string | null)?.trim() || null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Not configured.", success: false };

  const { error } = await supabase.auth.updateUser({ data: { display_name: displayName } });
  if (error) return { error: error.message, success: false };
  return { error: null, success: true };
}

export type ForgotPasswordState = {
  error: string | null;
  success: boolean;
};

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get("email") as string;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return { error: "Auth not configured.", success: false };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Always return success to avoid leaking whether an email exists
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return { error: null, success: true };
}

export async function signOutAction(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/");
}
```

---

## 16. app/(auth)/signup/page.tsx

```typescript
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignupPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-content-muted">
          Step 1 of 2 — then choose your plan
        </p>
      </div>

      <div className="rounded-xl border border-border bg-base-surface p-6">
        <SignupForm />
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 text-xs text-content-muted">
        <span className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          30-day money-back guarantee
        </span>
        <span className="opacity-30">·</span>
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}
```

---

## 17. app/(auth)/check-email/page.tsx

```typescript
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-base-surface">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-content-secondary">
          We&apos;ve sent you a confirmation email. Click the link inside to
          activate your account, then come back here to sign in.
        </p>

        <div className="mt-4 rounded-lg border border-border bg-base-elevated px-4 py-3">
          <p className="text-xs text-content-muted">
            Didn&apos;t receive anything? Check your spam folder, or{" "}
            <Link
              href="/signup"
              className="text-content-secondary underline-offset-2 hover:underline"
            >
              try again with a different address
            </Link>
            .
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg border border-border bg-base-elevated px-6 py-3 text-sm text-content-secondary transition-colors hover:border-border-strong hover:text-content-primary"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 18. app/auth/callback/route.ts

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  // Validate next to prevent open redirect — must be a relative path
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("://")
    ? rawNext
    : "/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/forgot-password?error=link_expired`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
```

---

## 19. app/(admin)/layout.tsx

```typescript
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminEmail = process.env.ADMIN_EMAIL;

  let email = "admin@psdfuel.com";

  if (!demoMode) {
    const supabase = await getSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) redirect("/login");

    // If ADMIN_EMAIL is configured, enforce it
    if (adminEmail && user.email !== adminEmail) {
      redirect("/dashboard");
    }

    email = user.email ?? email;
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminNav email={email} />
      <main className="pl-56">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
```

---

## 20. next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

---

## 21. .env.example

```
# ─────────────────────────────────────────────────────────────────────────────
# PSDfuel — Environment Variables
# Copy this file to .env.local and fill in the values.
# Add all of these to Vercel: Settings → Environment Variables
# ─────────────────────────────────────────────────────────────────────────────

# ─── Supabase ─────────────────────────────────────────────────────────────────
# Create project at https://supabase.com
# Find these at: Project Settings → API

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Find this at: Project Settings → API → service_role key (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── Stripe ───────────────────────────────────────────────────────────────────
# Create account at https://stripe.com
# Find keys at: Developers → API keys

STRIPE_SECRET_KEY=sk_live_...          # or sk_test_... for testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Create two recurring prices in Stripe Dashboard → Products
# Monthly: $19/month   → copy the price ID (starts with price_)
# Yearly:  $149/year   → copy the price ID (starts with price_)
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx

# Webhook secret — from Stripe Dashboard → Webhooks → your endpoint → Signing secret
# Local testing: use `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ─── Cloudflare R2 (PSD file storage) ────────────────────────────────────────
# Create bucket at https://dash.cloudflare.com → R2
# Create API token: Manage R2 API Tokens → Create token (Object Read & Write)

R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=psdfuel-assets
R2_PUBLIC_URL=https://assets.psdfuel.com   # Custom domain on R2 bucket (optional)

# ─── Resend (transactional email) ─────────────────────────────────────────────
# Create account at https://resend.com
# Create API key at: API Keys → Create API Key

RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=info@psdfuel.com
```

---

## 22. lib/config/site.ts

```typescript
import { categoryNames } from "@/lib/config/categories";

export const siteConfig = {
  name: "PSDfuel",
  description:
    "Premium editable PSD thumbnail assets for YouTube creators and designers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://psdfuel.com",
  plans: {
    monthly: {
      id: "monthly",
      label: "Monthly",
      price: 19,
      interval: "month" as const,
    },
    yearly: {
      id: "yearly",
      label: "Yearly",
      price: 149,
      interval: "year" as const,
      savings: "Save 35%",
    },
  },
  categories: categoryNames,
} as const;

export type SitePlanId = keyof typeof siteConfig.plans;
export type AssetCategoryName = string;
```

---

## 23. components/marketing/announcement-bar.tsx

```typescript
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const STORAGE_KEY = "psdfuel-announcement-v1"

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center gap-2.5 border-b border-accent/15 bg-accent/[0.06] px-4 py-2 text-xs">
      {/* Pulsing dot */}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>

      <p className="text-content-secondary">
        <span className="font-medium text-content-primary">Founding member pricing</span>
        {" — "}lock in <span className="font-semibold text-accent">$19/mo</span> at the founding rate before we raise prices.{" "}
        <Link
          href="/pricing"
          className="font-medium text-content-primary underline underline-offset-2 transition-colors hover:text-accent"
        >
          Claim your spot →
        </Link>
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="ml-1 shrink-0 text-content-muted/40 transition-colors hover:text-content-muted"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Founding spots progress — thin bar at bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-accent/8">
        <div className="h-full bg-accent/50" style={{ width: "78%" }} />
      </div>
    </div>
  )
}
```

---

## 24. components/marketing/activity-toast.tsx

(Full content showing a component that displays user activity toasts with 56 sample activities interleaved with subscription/download actions, masking usernames, and rotating through at set intervals)

---

## 25. components/marketing/footer.tsx

```typescript
"use client";

import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { Separator } from "@/components/ui/separator";

const productLinks = [
  { label: "Pricing",         href: "/pricing" },
  { label: "Library",         href: "/library" },
  { label: "Sign in",         href: "/login" },
  { label: "Get access",      href: "/signup" },
];

const supportLinks = [
  { label: "info@psdfuel.com", href: "mailto:info@psdfuel.com" },
];

const legalLinks = [
  { label: "Privacy Policy",  href: "/privacy" },
  { label: "Terms of Service",href: "/terms" },
  { label: "Cookie Policy",   href: "/cookies" },
];

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium tracking-widest text-content-muted uppercase">
        {heading}
      </p>
      <nav className="flex flex-col gap-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-content-secondary transition-colors hover:text-content-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-base">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="flex max-w-xs flex-col gap-4">
            <Wordmark />
            <p className="text-sm leading-relaxed text-content-muted">
              Premium editable PSD thumbnail assets for YouTube creators and
              professional designers.
            </p>
            {/* Guarantee badge */}
            <div className="flex items-center gap-2 text-xs text-content-muted">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              30-day money-back guarantee
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
            <FooterLinkGroup heading="Product"  links={productLinks} />
            <FooterLinkGroup heading="Legal"    links={legalLinks} />
            <FooterLinkGroup heading="Support"  links={supportLinks} />
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-xs text-content-muted">
            © {new Date().getFullYear()} PSDfuel. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-content-muted/50">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Payments secured by Stripe
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-1.5 text-xs text-content-muted/40 transition-colors hover:text-content-muted"
              aria-label="Scroll to top"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

## 26. app/(marketing)/pricing/page.tsx

(First 100 lines shown - complete pricing page with hero, plan cards, testimonials, library snapshot, product highlights, included features, FAQ, and CTA sections. Full file is 497 lines.)

---

## 27. lib/mock/mock-assets.ts

(First 50 lines shown - demonstrates asset structure with id, slug, title, descriptions, category, style_type, metadata. Full file contains 39 assets with complete details across all categories.)

---

## 28. components/ui/checkout-button.tsx

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

interface CheckoutButtonProps {
  planId: "monthly" | "yearly";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ planId, className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      // Check if user is logged in
      const supabase = getSupabaseBrowserClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/signup?plan=${planId}`);
          return;
        }
      }

      // Create Stripe checkout session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "contents" }}>
      <button
        onClick={handleClick}
        disabled={loading}
        className={cn(className)}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && (
        <p className="mt-2 text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
```

---

## 29. app/(marketing)/terms/page.tsx

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  {
    heading: "Acceptance of terms",
    body: `By creating an account or accessing any part of PSDfuel, you agree to be bound by these Terms of Service. If you do not agree, do not use the service. We may update these terms from time to time — continued use after changes constitutes acceptance.`,
  },
  {
    heading: "Your subscription",
    body: `PSDfuel is a subscription-based service. Your subscription grants you a non-exclusive, non-transferable license to access and download assets from the library for the duration of your active subscription. Subscriptions renew automatically unless cancelled before the renewal date.`,
  },
  {
    heading: "What you can do with the assets",
    body: `Your subscription includes a commercial license. You may use downloaded assets in your own YouTube videos, client work, and sponsored content. You may not resell, redistribute, or sublicense the raw PSD files themselves, or include them in any product that competes with PSDfuel.`,
  },
  {
    heading: "What you cannot do",
    body: `You may not share your account credentials with others. You may not bulk-download assets for offline archiving or resale. You may not reverse-engineer, decompile, or use the files to build competing asset libraries. Violation of these terms will result in immediate account termination without refund.`,
  },
  {
    heading: "Cancellation and refunds",
    body: `You may cancel your subscription at any time. Access continues until the end of the current billing period. We offer a 30-day money-back guarantee for first-time subscribers — email info@psdfuel.com within 30 days of your first charge to request a full refund, no questions asked.`,
  },
  {
    heading: "Intellectual property",
    body: `All assets, designs, code, and content on PSDfuel remain the intellectual property of PSDfuel. Your subscription grants you a license to use the assets — it does not transfer ownership. We reserve all rights not expressly granted.`,
  },
  {
    heading: "Service availability",
    body: `We aim for 99.9% uptime but make no guarantees. We may perform maintenance, update the library, or modify features at any time. We are not liable for any loss caused by downtime or changes to the service.`,
  },
  {
    heading: "Limitation of liability",
    body: `To the maximum extent permitted by law, PSDfuel shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid in the 12 months prior to the claim.`,
  },
  {
    heading: "Governing law",
    body: `These terms are governed by the laws of the Netherlands. Any disputes shall be subject to the exclusive jurisdiction of Dutch courts.`,
  },
  {
    heading: "Contact",
    body: `Questions about these terms? Email us at info@psdfuel.com. We aim to respond within 5 business days.`,
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-content-muted">
        Last updated: March 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        These Terms of Service govern your access to and use of PSDfuel. Please
        read them carefully before subscribing.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-2 text-sm font-semibold text-content-primary">
              {s.heading}
            </h2>
            <p className="text-sm leading-relaxed text-content-secondary">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 30. app/(marketing)/privacy/page.tsx

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  {
    heading: "What we collect",
    body: `When you create an account we collect your email address and a hashed password. When you subscribe we store your Stripe customer ID and subscription status — we never store raw card numbers. We also collect basic usage data (page views, download events) to improve the product.`,
  },
  {
    heading: "How we use your data",
    body: `Your email is used to send account-related messages (receipts, password resets, product updates). We do not sell or rent your data to third parties. Usage analytics are aggregated and never tied to personally identifiable information.`,
  },
  {
    heading: "Cookies",
    body: `We use a small number of cookies strictly necessary for authentication and session management. We also use analytics cookies (opt-in via our cookie banner) to understand how visitors use the site. See our Cookie Policy for full details.`,
  },
  {
    heading: "Third-party services",
    body: `We use Stripe for payment processing — your payment data is handled entirely by Stripe and subject to their privacy policy. We use Vercel for hosting and Supabase for our database, both of which process data in accordance with GDPR.`,
  },
  {
    heading: "Data retention",
    body: `Account data is retained for as long as your account is active. After account deletion, personal data is removed within 30 days. Anonymised analytics data may be retained indefinitely.`,
  },
  {
    heading: "Your rights (GDPR)",
    body: `If you are in the EEA you have the right to access, correct, export, or delete your personal data at any time. You also have the right to object to processing and to withdraw consent. To exercise any of these rights, email us at info@psdfuel.com.`,
  },
  {
    heading: "Changes to this policy",
    body: `We may update this policy from time to time. We will notify active subscribers of significant changes via email. The date at the top of this page reflects the most recent revision.`,
  },
  {
    heading: "Contact",
    body: `Questions about privacy? Email us at info@psdfuel.com. We aim to respond within 5 business days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
        Legal
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-content-primary">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-content-muted">
        Last updated: March 2026
      </p>

      <p className="mt-8 text-sm leading-relaxed text-content-secondary">
        PSDfuel (&ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This
        policy explains what data we collect, how we use it, and your rights.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="mb-2 text-sm font-semibold text-content-primary">
              {s.heading}
            </h2>
            <p className="text-sm leading-relaxed text-content-secondary">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

All files have been successfully read and presented. This is a comprehensive view of the PSDfuel platform's core infrastructure, including the database schema, service/repository layers, authentication, billing webhooks, UI components, and legal pages. The architecture demonstrates a clean separation between mock implementations and Supabase adapters, allowing for flexible switching between demo and production modes.agentId: a5ce552a247cb4708 (for resuming to continue this agent's work if needed)
<usage>total_tokens: 91662
tool_uses: 30
duration_ms: 141439</usage>