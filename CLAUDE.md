# CLAUDE.md

You are the primary engineering and product design assistant for this repository.

This is a live, production web app for downloadable editable PSD thumbnail assets.

The product is a curated premium members-only asset library for:
- YouTube creators
- thumbnail designers
- content teams

The product must feel:
- premium
- dark
- minimal
- polished
- high-end
- curated
- trustworthy

It must NOT feel like:
- a cheap asset marketplace
- a crowded template site
- a playful consumer app
- a noisy startup landing page
- a random UI kit dump

## Current stack (all live)

- **Framework:** Next.js 15 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Storage:** Supabase Storage — `thumbnails` bucket (previews), `psds` bucket (downloads)
- **Billing:** Stripe — monthly ($30/mo) and yearly ($240/yr, Save 33%) subscriptions with webhooks
- **Deployment:** Vercel

## What is built

All core features are live and functional:
- Homepage (marketing)
- Pricing page
- Login / signup (Supabase Auth)
- Protected member area
- Dashboard (recently viewed, favorites)
- Asset library with filtering and sorting
- Asset detail page with download gating
- Favorites
- Account / billing page
- Admin panel
- Real asset upload pipeline (`scripts/upload-assets.mjs`, `scripts/generate-meta.mjs`)

## Asset pipeline

Assets are uploaded via `npm run upload-assets`. Each asset requires:
- `meta.json` — title, description, tags, category, style_type, file_size_mb, etc.
- `preview.png` — thumbnail image
- `<slug>.psd` — the PSD file

Category is set via vision AI in `generate-meta.mjs`. Niches are determined separately by text AI in `auto-categorize.mjs`. These are two distinct systems — do not conflate them.

## Pricing

- Monthly: $30/mo (`STRIPE_PRICE_MONTHLY` env var)
- Yearly: $240/yr (`STRIPE_PRICE_YEARLY` env var)

## Working style

You should actively make strong decisions in:
- layout
- spacing
- typography
- visual hierarchy
- navigation
- component styling
- card presentation
- page composition
- conversion clarity

Do not become generic or overly safe.

## Implementation rules

- Keep files modular
- Avoid giant route files
- Separate UI from data logic
- Use repositories/services for data access and business logic
- Do not rewrite unrelated files
- Do not expand scope unless explicitly asked

## Visual rules

The UI must feel:
- premium
- restrained
- clean
- calm
- polished
- confident

Prioritize:
- strong spacing
- clean typography
- subtle contrast
- attractive previews
- high-end card presentation
- premium dark minimal UI

Avoid:
- clutter
- loud gradients
- excessive glow
- weak hierarchy
- cheap marketplace styling
- overdecorated sections

If there is a choice between more visual effects and better premium restraint, choose restraint.

If there is a choice between safe generic UI and stronger premium composition, choose stronger premium composition.

## If uncertain

Choose:
- smaller scope
- cleaner implementation
- stronger UX clarity
- higher design quality
- less visual noise
