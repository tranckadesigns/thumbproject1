// Auth Adapter Boundary
//
// This is the future integration point for real auth (e.g. Supabase Auth).
//
// In Phase 8:
//   - Create a SupabaseAuthAdapter that implements IAuthService
//   - Replace MockAuthService with SupabaseAuthAdapter
//   - No page-level code should need to change
//
// import type { IAuthService } from "@/lib/services/auth-service";
//
// export class SupabaseAuthAdapter implements IAuthService {
//   async getSession() { ... }
//   async signIn(email, password) { ... }
//   async signUp(email, password, fullName) { ... }
//   async signOut() { ... }
// }
