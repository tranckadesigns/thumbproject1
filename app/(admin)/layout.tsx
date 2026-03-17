import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;

  // ADMIN_EMAIL must be configured — without it, block all access to /admin
  if (!adminEmail) {
    redirect("/dashboard");
  }

  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) redirect("/login");

  if (user.email !== adminEmail) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminNav email={user.email ?? adminEmail} />
      <main className="pl-56">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
