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

  if (!user) redirect("/login");

  const subscribed = await hasActiveSubscription();
  if (!subscribed) redirect("/pricing");

  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? undefined;

  return (
    <div className="min-h-screen bg-base">
      <AppNav email={user.email ?? ""} hasSubscription={subscribed} displayName={displayName} />
      <main className="pt-14">{children}</main>
    </div>
  );
}
