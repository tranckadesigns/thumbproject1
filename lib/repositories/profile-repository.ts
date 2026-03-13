import type { Profile } from "@/types/profile";

export interface IProfileRepository {
  getById(id: string): Promise<Profile | null>;
  getByEmail(email: string): Promise<Profile | null>;
  update(id: string, data: Partial<Profile>): Promise<Profile>;
}

// Mock implementation — replace with Supabase adapter in Phase 8.
export class MockProfileRepository implements IProfileRepository {
  private profiles: Profile[];

  constructor(seed: Profile[] = []) {
    this.profiles = seed;
  }

  async getById(id: string): Promise<Profile | null> {
    return this.profiles.find((p) => p.id === id) ?? null;
  }

  async getByEmail(email: string): Promise<Profile | null> {
    return this.profiles.find((p) => p.email === email) ?? null;
  }

  async update(id: string, data: Partial<Profile>): Promise<Profile> {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Profile not found");
    this.profiles[index] = { ...this.profiles[index], ...data };
    return this.profiles[index];
  }
}
