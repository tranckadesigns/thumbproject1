import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Support single email or comma-separated list: ADMIN_EMAIL=a@x.com,b@x.com
  const adminEmailsRaw = process.env.ADMIN_EMAIL ?? "";
  const adminEmails = adminEmailsRaw.split(",").map((e) => e.trim()).filter(Boolean);

  if (adminEmails.length === 0) {
    redirect("/dashboard");
  }

  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  if (!user) redirect("/login");

  if (!user.email || !adminEmails.includes(user.email)) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-base">
      <AdminNav email={user.email ?? adminEmails[0]} />
      <main className="pl-56">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
