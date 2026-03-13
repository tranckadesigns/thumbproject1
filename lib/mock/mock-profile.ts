import type { Profile } from "@/types/profile";

// Three demo profiles covering the main mock auth states.
// Used by MockAuthService in Phase 3.

export const mockMemberProfile: Profile = {
  id: "mock-member-001",
  email: "member@demo.com",
  full_name: "Alex Morgan",
  role: "member",
  subscription_status: "active",
  plan_type: "monthly",
  created_at: "2025-01-15T00:00:00Z",
};

export const mockAdminProfile: Profile = {
  id: "mock-admin-001",
  email: "admin@demo.com",
  full_name: "Jordan Lee",
  role: "admin",
  subscription_status: "active",
  plan_type: "yearly",
  created_at: "2025-01-01T00:00:00Z",
};

export const mockUnsubscribedProfile: Profile = {
  id: "mock-member-002",
  email: "free@demo.com",
  full_name: "Sam Taylor",
  role: "member",
  subscription_status: "inactive",
  plan_type: null,
  created_at: "2025-09-01T00:00:00Z",
};
