import type { BillingState } from "@/types/billing";

// Three billing states covering the main subscription scenarios.
// Wired to billing service in Phase 6.

export const mockActiveMonthlyBilling: BillingState = {
  status: "active",
  plan: {
    id: "monthly",
    label: "Monthly",
    price: 19,
    interval: "month",
  },
  current_period_end: "2026-04-13T00:00:00Z",
  cancel_at_period_end: false,
};

export const mockActiveYearlyBilling: BillingState = {
  status: "active",
  plan: {
    id: "yearly",
    label: "Yearly",
    price: 149,
    interval: "year",
    savings: "Save 35%",
  },
  current_period_end: "2027-03-13T00:00:00Z",
  cancel_at_period_end: false,
};

export const mockInactiveBilling: BillingState = {
  status: "inactive",
  plan: null,
  current_period_end: null,
  cancel_at_period_end: false,
};
