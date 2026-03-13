# Integration Plan

## Goal

Real integrations come later and should replace mocks cleanly.

## Future Integration Targets

### Auth
Potential target:
- Supabase Auth

Replace:
- mock session service
- mock role guard

### Database
Potential target:
- Supabase Postgres or equivalent

Replace:
- local mock repositories
- local asset/favorite/profile state

### Billing
Potential target:
- Stripe

Replace:
- mock plan state
- placeholder upgrade actions
- placeholder billing actions

### Storage
Potential target:
- S3-compatible storage

Replace:
- placeholder file references
- demo download behavior

## Rule

Build boundaries now so live integrations are a swap, not a rebuild.
