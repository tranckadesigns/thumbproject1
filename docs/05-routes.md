# Routes

## Public Routes
- /
- /pricing
- /login
- /signup

## Protected Member Routes
- /app
- /app/library
- /app/library/[slug]
- /app/favorites
- /app/account

## Protected Admin Routes
- /admin
- /admin/assets
- /admin/assets/new
- /admin/assets/[id]/edit

## Route Rule

In the early demo build, protected routes may use mock session and role guards.
These should later be replaceable with real auth guards.
