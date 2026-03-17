import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-content-primary">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-content-muted">
          Sign in to access your library
        </p>
      </div>

      <div className="rounded-xl border border-border bg-base-surface p-6">
        <LoginForm next={next} />
      </div>
    </div>
  );
}
