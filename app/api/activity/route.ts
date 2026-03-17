import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const revalidate = 300; // cache 5 minutes

// Deterministic color from a string (same user → same color every time)
function colorFromString(str: string): string {
  const colors = [
    "#C9A96E", "#818CF8", "#34D399", "#4ADE80", "#A78BFA",
    "#38BDF8", "#FB923C", "#F472B6", "#10B981", "#F59E0B",
    "#E879F9", "#14B8A6", "#6366F1", "#84CC16", "#FB7185",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function maskName(name: string): string {
  if (!name) return "Someone";
  const maskCount = Math.ceil(name.length * 0.4);
  const visibleCount = name.length - maskCount;
  return name.slice(0, visibleCount) + "*".repeat(maskCount);
}

function nameFromEmail(email: string): string {
  return email.split("@")[0];
}

export async function GET() {
  const sb = getSupabaseServiceClient();
  const now = Date.now();
  // Only fetch events from the last 48 hours
  const cutoff = new Date(now - 48 * 60 * 60 * 1000).toISOString();

  const [downloadsResult, subscriptionsResult] = await Promise.all([
    sb
      .from("downloads")
      .select("downloaded_at, asset_id, user_id, assets(title), profiles(email)")
      .gte("downloaded_at", cutoff)
      .order("downloaded_at", { ascending: false })
      .limit(40), // fetch more, then dedup per user below

    sb
      .from("subscriptions")
      .select("created_at, user_id, profiles(email)")
      .eq("status", "active")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const events: {
    type: "download" | "subscription";
    maskedName: string;
    assetTitle?: string;
    minutesAgo: number;
    color: string;
  }[] = [];

  // Deduplicate downloads by user_id — keep only the most recent per user
  const seenDownloadUsers = new Set<string>();
  for (const d of downloadsResult.data ?? []) {
    if (seenDownloadUsers.has(d.user_id)) continue;
    seenDownloadUsers.add(d.user_id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const email = (d as any).profiles?.email as string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const assetTitle = (d as any).assets?.title as string | undefined;
    if (!email) continue;
    const minutesAgo = Math.max(1, Math.floor((now - new Date(d.downloaded_at).getTime()) / 60000));
    events.push({
      type: "download",
      maskedName: maskName(nameFromEmail(email)),
      assetTitle,
      minutesAgo,
      color: colorFromString(d.user_id),
    });
  }

  for (const s of subscriptionsResult.data ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const email = (s as any).profiles?.email as string | undefined;
    if (!email) continue;
    const minutesAgo = Math.max(1, Math.floor((now - new Date(s.created_at).getTime()) / 60000));
    events.push({
      type: "subscription",
      maskedName: maskName(nameFromEmail(email)),
      minutesAgo,
      color: colorFromString(s.user_id),
    });
  }

  // Sort by most recent first, cap at 15
  events.sort((a, b) => a.minutesAgo - b.minutesAgo);

  // Return empty array if no recent activity → client falls back to static set
  return NextResponse.json(events.slice(0, 15));
}
