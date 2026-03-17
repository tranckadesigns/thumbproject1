-- ─────────────────────────────────────────────────────────────────────────────
-- PSDfuel — Supabase Schema  (canonical — run this to set up a fresh project)
-- Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Profiles ─────────────────────────────────────────────────────────────────
-- One row per user, auto-created on signup via trigger below.

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── Subscriptions ────────────────────────────────────────────────────────────
-- One row per user. Updated by Stripe webhook.
-- status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing'

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
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

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS subscriptions_user_idx ON public.subscriptions (user_id);

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
  download_count    INTEGER       NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published assets are publicly readable" ON public.assets;
CREATE POLICY "Published assets are publicly readable"
  ON public.assets FOR SELECT
  USING (is_published = true);

CREATE INDEX IF NOT EXISTS assets_category_idx      ON public.assets (category);
CREATE INDEX IF NOT EXISTS assets_published_idx     ON public.assets (is_published);
CREATE INDEX IF NOT EXISTS assets_featured_idx      ON public.assets (is_featured);
CREATE INDEX IF NOT EXISTS assets_created_at_idx    ON public.assets (created_at DESC);
CREATE INDEX IF NOT EXISTS assets_download_count_idx ON public.assets (download_count DESC);

DROP TRIGGER IF EXISTS assets_updated_at ON public.assets;
CREATE TRIGGER assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Favorites ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_id   UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, asset_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own favorites" ON public.favorites;
CREATE POLICY "Users can read own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS favorites_user_idx  ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS favorites_asset_idx ON public.favorites (asset_id);

-- ─── Downloads ────────────────────────────────────────────────────────────────
-- One row per download event.

CREATE TABLE IF NOT EXISTS public.downloads (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  asset_id      UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own downloads" ON public.downloads;
CREATE POLICY "Users can view own downloads"
  ON public.downloads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own downloads" ON public.downloads;
CREATE POLICY "Users can insert own downloads"
  ON public.downloads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS downloads_user_idx  ON public.downloads (user_id);
CREATE INDEX IF NOT EXISTS downloads_asset_idx ON public.downloads (asset_id);

-- ─── Categories ───────────────────────────────────────────────────────────────
-- type: 'broad' = fixed top-level bucket | 'niche' = auto-created by upload script

CREATE TABLE IF NOT EXISTS public.categories (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        NOT NULL UNIQUE,
  name            TEXT        NOT NULL,
  description     TEXT        NOT NULL DEFAULT '',
  type            TEXT        NOT NULL DEFAULT 'niche',
  is_auto_created BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories (slug);
CREATE INDEX IF NOT EXISTS categories_type_idx ON public.categories (type);

INSERT INTO public.categories (slug, name, description, type, is_auto_created) VALUES
  ('revenue',     'Revenue',     'Earnings, payouts & income notifications',    'broad', false),
  ('subscribers', 'Subscribers', 'Milestone popups & live counters',            'broad', false),
  ('growth',      'Growth',      'Views, charts & channel performance',          'broad', false),
  ('alerts',      'Alerts',      'Live alerts, breaking news & warnings',        'broad', false),
  ('social',      'Social',      'Instagram, Twitter & TikTok proof',            'broad', false),
  ('e-commerce',  'E-Commerce',  'Sales, products & ecommerce data',             'broad', false),
  ('analytics',   'Analytics',   'CTR, impressions & watch time',                'broad', false),
  ('challenges',  'Challenges',  'Progress bars, streaks & day trackers',        'broad', false),
  ('comparisons', 'Comparisons', 'Before/after & best vs worst frames',          'broad', false),
  ('ratings',     'Ratings',     'Stars, scores & review summaries',             'broad', false),
  ('timers',      'Timers',      'Countdown clocks & live event timers',         'broad', false),
  ('reactions',   'Reactions',   'Polls, votes & emoji reactions',               'broad', false)
ON CONFLICT (slug) DO NOTHING;

-- ─── Asset–Category junction ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.asset_categories (
  asset_id    UUID    NOT NULL REFERENCES public.assets(id)      ON DELETE CASCADE,
  category_id UUID    NOT NULL REFERENCES public.categories(id)  ON DELETE CASCADE,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (asset_id, category_id)
);

ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Asset categories are publicly readable" ON public.asset_categories;
CREATE POLICY "Asset categories are publicly readable"
  ON public.asset_categories FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS asset_categories_asset_idx    ON public.asset_categories (asset_id);
CREATE INDEX IF NOT EXISTS asset_categories_category_idx ON public.asset_categories (category_id);

-- ─── Functions & Triggers ─────────────────────────────────────────────────────

-- Auto-create profile on signup
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

-- Auto-update updated_at
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

-- Increment download counter (called from download API route)
CREATE OR REPLACE FUNCTION public.increment_download_count(asset_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.assets
  SET download_count = download_count + 1
  WHERE id = asset_id;
$$;
