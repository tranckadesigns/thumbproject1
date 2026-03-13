# Architecture

## Architecture Principle

The project must be buildable in two layers:

### Layer 1 — Demo-ready product shell
No external services required.
Uses:
- local mock data
- mock auth/session
- mock subscription states
- placeholder download behavior

### Layer 2 — Real integrations
Added later without major refactors.
Uses:
- real auth
- real database
- real billing
- real storage
- real download protection

## Tech Direction

Initial implementation:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible component structure

Later integrations may include:
- Supabase Auth + Postgres
- Stripe
- S3-compatible storage
- Vercel deployment

## Near-Term Development Rule

Do not require those integrations to complete the initial product build.

## App Areas

1. Public marketing area
- homepage
- pricing
- login
- signup

2. Protected member area
- dashboard
- library
- asset detail
- favorites
- account/billing

3. Protected admin area
- asset management
- asset create/edit
- metadata management

## Code Structure Goals

Separate:
- route-level UI
- reusable UI components
- mock data layer
- future integration layer
- business logic
- types
- utility helpers

## Important Structural Rule

All mocked systems should be replaceable.

Do not hardwire the whole app directly to fake data inside page files.
Use a structured mock layer so it can later be swapped for real services.
