import type { Session } from "@/types/session";

export interface IAuthService {
  getSession(): Promise<Session | null>;
  signIn(email: string, password: string): Promise<Session>;
  signUp(email: string, password: string, fullName: string): Promise<Session>;
  signOut(): Promise<void>;
}

// Placeholder — MockAuthService will be fully wired in Phase 3.
// Replace with real auth adapter (e.g. Supabase) in Phase 8.
export class MockAuthService implements IAuthService {
  private currentSession: Session | null = null;

  setSession(session: Session | null) {
    this.currentSession = session;
  }

  async getSession(): Promise<Session | null> {
    return this.currentSession;
  }

  async signIn(_email: string, _password: string): Promise<Session> {
    throw new Error("MockAuthService.signIn — wire in Phase 3");
  }

  async signUp(
    _email: string,
    _password: string,
    _fullName: string
  ): Promise<Session> {
    throw new Error("MockAuthService.signUp — wire in Phase 3");
  }

  async signOut(): Promise<void> {
    this.currentSession = null;
  }
}
