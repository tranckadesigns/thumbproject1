import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { hasActiveSubscription } from "@/lib/subscription";
import { AppNav } from "@/components/members/app-nav";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // No Supabase configured → demo mode, skip auth + subscription checks
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!demoMode) {
    // Not logged in → send to login
    if (!user) redirect("/login");

    // Logged in but no active subscription → send to pricing
    const subscribed = await hasActiveSubscription();
    if (!subscribed) redirect("/pricing");
  }

  const email = user?.email ?? "demo@psdfuel.com";

  return (
    <div className="min-h-screen bg-base">
      <AppNav email={email} />
      <main className="pt-14">{children}</main>
    </div>
  );
}
