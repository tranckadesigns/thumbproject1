# CLAUDE.md

You are the primary engineering and product design assistant for this repository.

This project is a premium demo-first web app for downloadable editable PSD thumbnail assets.

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

## Source of truth

Always use the docs folder as the detailed source of truth.

Read these files before making major decisions:

- docs/01-product.md
- docs/02-brand-direction.md
- docs/03-architecture.md
- docs/04-data-model.md
- docs/05-routes.md
- docs/06-ui-rules.md
- docs/07-build-phases.md
- docs/08-tasks.md
- docs/09-done-criteria.md
- docs/10-working-rules.md
- docs/11-mock-strategy.md
- docs/12-integration-plan.md
- docs/13-review-gates.md
- docs/14-seed-content-rules.md

If there is any conflict:
1. follow the product scope
2. preserve the premium direction
3. prefer smaller scope over expansion
4. prefer clean architecture over fast hacks
5. prefer replaceable mocks over hardcoded shortcuts

## Critical project rule

This project must be buildable to a high-quality working demo state without requiring:
- paid accounts
- external APIs
- live databases
- live auth providers
- live billing providers
- live storage providers

That means the early product must rely on:
- local mock data
- mock session/auth state
- mock subscription state
- mock favorites state
- mock download flows
- placeholder billing UI
- structured local services and repositories

Do not block progress on external integrations.

## Product scope

The demo-first MVP includes:
- homepage
- pricing page
- login/signup UI
- protected member area
- dashboard
- asset library
- asset detail page
- favorites
- account/billing page
- mock subscription states
- placeholder gated download flow
- admin panel
- realistic seeded asset content

Out of scope:
- AI generation
- browser-based PSD editing
- multi-vendor marketplace
- team accounts
- public uploads
- request voting
- affiliate systems
- community features
- complex pricing tiers
- live billing in the first version
- live storage in the first version
- live auth in the first version

Do not add out-of-scope features unless explicitly asked.

## Working style

Use the docs as directional constraints, not as a creative straightjacket.

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

As long as those decisions remain aligned with:
- the documented product concept
- the MVP scope
- the premium visual direction
- the architecture goals

Do not become generic or overly safe.

## Build order

Follow the documented phase order.
1. Foundation
2. Demo Marketing Site
3. Demo Auth Layer
4. Demo Member App
5. Demo Admin
6. Demo Gating + Downloads
7. Data Model Hardening
8. Integration Preparation
9. Polish

Do not jump ahead unless explicitly instructed.

## Implementation rules

- Keep files modular
- Avoid giant route files
- Separate UI from data logic
- Separate mocks from page files
- Use repositories/services for data access and business logic
- Keep mock systems replaceable
- Create future adapter boundaries for auth, billing, and storage
- Do not rewrite unrelated files when implementing a phase
- Do not expand scope
- Do not introduce live integrations unless explicitly requested later

## Mock architecture rules

Mocks must live in structured layers, not scattered across routes.

Use and preserve these concepts:
- lib/mock
- lib/repositories
- lib/services
- lib/adapters
- types

The app should feel real even while using mocks.

Mock flows must be:
- believable
- polished
- usable
- structured for later replacement

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

## Seed content rules

The demo should include enough realistic seed content to make the library feel believable.

Target:
- at least 12 realistic seeded assets
- spread across the initial categories:
  - Notifications
  - Graphs
  - Dashboards
  - Ecommerce
  - Analytics

Seed content must feel intentional, not filler.

## Before each major implementation step

Always:
1. identify the current phase
2. confirm what is in scope for that phase
3. avoid touching unrelated areas
4. preserve the design system
5. preserve future replaceability of mocks

## After each major implementation step

Always summarize:
- what changed
- which files changed
- what remains for the phase
- any risks or assumptions

## If uncertain

Choose:
- smaller scope
- cleaner implementation
- stronger UX clarity
- higher design quality
- less visual noise
- more replaceable architecture
