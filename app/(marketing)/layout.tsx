import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { MagneticLiquid } from "@/components/marketing/magnetic-liquid";
import { ActivityToast } from "@/components/marketing/activity-toast";
import { StickyCTABar } from "@/components/marketing/sticky-cta-bar";
import { CookieConsent } from "@/components/marketing/cookie-consent";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { ReadingProgress } from "@/components/marketing/reading-progress";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const demoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <>
      <ReadingProgress />
      <AnnouncementBar />
      <Nav isLoggedIn={!!user || demoMode} />
      <MagneticLiquid targetId="hero-get-access" />
      <main>{children}</main>
      <Footer />
      <ActivityToast />
      <StickyCTABar />
      <ScrollToTop />
      <CookieConsent />
    </>
  );
}
