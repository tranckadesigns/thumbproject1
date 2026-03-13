import type { UserRole, SubscriptionStatus, PlanType } from "./profile";

export interface Session {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  plan_type: PlanType;
}

export type AuthState = "loading" | "authenticated" | "unauthenticated";
