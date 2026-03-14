import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminEmail = process.env.ADMIN_EMAIL;

  let email = "admin@psdfuel.com";

  if (!demoMode) {
    const supabase = await getSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user) redirect("/login");

    // If ADMIN_EMAIL is configured, enforce it
    if (adminEmail && user.email !== adminEmail) {
      redirect("/dashboard");
    }

    email = user.email ?? email;
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminNav email={email} />
      <main className="pl-56">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
