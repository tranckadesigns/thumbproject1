export type UserRole = "member" | "admin";

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "canceled"
  | "past_due";

export type PlanType = "monthly" | "yearly" | null;

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  plan_type: PlanType;
  created_at: string;
}
