import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AppNav } from "@/components/members/app-nav";

export default async function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-base">
      <AppNav email={user.email ?? "member"} />
      <main className="pt-14">{children}</main>
    </div>
  );
}
