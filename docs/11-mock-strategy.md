# Mock Strategy

## Goal

The application must work convincingly before real integrations exist.

## Mock Systems Required

### Mock Auth
Should support:
- logged out state
- logged in member state
- logged in admin state

### Mock Subscription
Should support:
- unsubscribed state
- active monthly state
- active yearly state

### Mock Assets
Should provide:
- enough sample assets for realistic browsing
- categories
- tags
- preview images
- metadata

### Mock Favorites
Should allow:
- saving/removing favorites in local app state

### Mock Downloads
Should allow:
- blocked behavior for unsubscribed users
- success state for subscribed users

### Mock Billing
Should provide:
- account plan display
- upgrade/downgrade placeholder actions
- billing status UI

## Architectural Rule

Mocks must live in a dedicated mock layer, not scattered across route files.

The future real implementation should be able to replace the mock services with minimal rewrite.
