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
