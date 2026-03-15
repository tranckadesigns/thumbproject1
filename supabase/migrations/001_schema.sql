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
