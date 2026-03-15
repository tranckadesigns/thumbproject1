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
