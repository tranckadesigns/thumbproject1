import type { BillingState } from "@/types/billing";

export interface IBillingService {
  getBillingState(userId: string): Promise<BillingState>;
  startUpgrade(userId: string, planId: string): Promise<void>;
  cancelSubscription(userId: string): Promise<void>;
}

// Placeholder — fully wired in Phase 6.
// Replace with Stripe adapter in Phase 8.
export class MockBillingService implements IBillingService {
  async getBillingState(_userId: string): Promise<BillingState> {
    return {
      status: "inactive",
      plan: null,
      current_period_end: null,
      cancel_at_period_end: false,
    };
  }

  async startUpgrade(_userId: string, _planId: string): Promise<void> {
    // Phase 6: wire upgrade prompt and mock plan change
  }

  async cancelSubscription(_userId: string): Promise<void> {
    // Phase 6: wire mock cancellation state
  }
}
