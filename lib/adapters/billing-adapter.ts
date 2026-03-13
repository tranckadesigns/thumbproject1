// Billing Adapter Boundary
//
// This is the future integration point for real billing (e.g. Stripe).
//
// In Phase 8:
//   - Create a StripeAdapter that implements IBillingService
//   - Replace MockBillingService with StripeAdapter
//   - No page-level code should need to change
//
// import type { IBillingService } from "@/lib/services/billing-service";
//
// export class StripeAdapter implements IBillingService {
//   async getBillingState(userId) { ... }
//   async startUpgrade(userId, planId) { ... }
//   async cancelSubscription(userId) { ... }
// }
