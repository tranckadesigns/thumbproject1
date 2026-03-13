import type { Session } from "@/types/session";

// Three session states for demo switching.
// Auth service will use these in Phase 3.

export const mockMemberSession: Session = {
  user_id: "mock-member-001",
  email: "member@demo.com",
  full_name: "Alex Morgan",
  role: "member",
  subscription_status: "active",
  plan_type: "monthly",
};

export const mockAdminSession: Session = {
  user_id: "mock-admin-001",
  email: "admin@demo.com",
  full_name: "Jordan Lee",
  role: "admin",
  subscription_status: "active",
  plan_type: "yearly",
};

export const mockUnsubscribedSession: Session = {
  user_id: "mock-member-002",
  email: "free@demo.com",
  full_name: "Sam Taylor",
  role: "member",
  subscription_status: "inactive",
  plan_type: null,
};
