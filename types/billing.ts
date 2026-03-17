export type BillingStatus =
  | "active"
  | "inactive"
  | "canceled"
  | "past_due"
  | "trialing";

export interface BillingPlan {
  id: string;
  label: string;
  price: number;
  interval: "month" | "year";
  savings?: string;
}

export interface BillingState {
  status: BillingStatus;
  plan: BillingPlan | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}
