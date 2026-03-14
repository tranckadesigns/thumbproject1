import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/members/app-nav";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Only requires auth — no subscription check
  if (!demoMode && !user) redirect("/login");

  const email = user?.email ?? "demo@psdfuel.com";

  return (
    <div className="min-h-screen bg-base">
      <AppNav email={email} />
      <main className="pt-14">{children}</main>
    </div>
  );
}
