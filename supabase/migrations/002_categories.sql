-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002 — Multi-category system
-- Run in Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Categories ───────────────────────────────────────────────────────────────
-- type: 'broad'  = one of the 12 fixed top-level buckets (never auto-created)
--       'niche'  = specific sub-topic, auto-created by the upload script

CREATE TABLE IF NOT EXISTS public.categories (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        NOT NULL UNIQUE,
  name            TEXT        NOT NULL,
  description     TEXT        NOT NULL DEFAULT '',
  type            TEXT        NOT NULL DEFAULT 'niche', -- 'broad' | 'niche'
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

-- ─── Seed the 12 broad categories ─────────────────────────────────────────────

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
-- is_primary = true  → the main broad category (exactly one per asset)
-- is_primary = false → additional niche categories

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
