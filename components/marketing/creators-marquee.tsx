"use client"

import Marquee from "react-fast-marquee"

// Maskeert de laatste 40% van een username met sterretjes — zelfde logica als activity-toast.
function maskUsername(name: string): string {
  const maskCount = Math.ceil(name.length * 0.4)
  const visibleCount = name.length - maskCount
  return name.slice(0, visibleCount) + "*".repeat(maskCount)
}

// Realistische verdeling: de meeste YouTube-creators hebben weinig abonnees.
// Slechts ~3% van kanalen heeft >100K. Dat moet je zien in deze sectie.
const row1 = [
  { initial: "M", name: "MarkBuilds",   subs: "1.2M",  niche: "Business",     color: "#C9A96E" },
  { initial: "S", name: "sophievlogs",  subs: "4.2K",  niche: "Lifestyle",    color: "#F472B6" },
  { initial: "J", name: "JordanTech",   subs: "2.4M",  niche: "Tech",         color: "#818CF8" },
  { initial: "N", name: "nina_plays",   subs: "22K",   niche: "Gaming",       color: "#34D399" },
  { initial: "T", name: "tyler_yt",     subs: "89K",   niche: "Finance",      color: "#FB923C" },
  { initial: "A", name: "aria_edits",   subs: "670K",  niche: "Tech Reviews", color: "#38BDF8" },
  { initial: "L", name: "lena.yt",      subs: "8.1K",  niche: "Fitness",      color: "#4ADE80" },
  { initial: "R", name: "RyanFilms",    subs: "340K",  niche: "Education",    color: "#A78BFA" },
]

const row2 = [
  { initial: "P", name: "priya_makes",  subs: "178K",  niche: "Cooking",      color: "#F59E0B" },
  { initial: "D", name: "diego_fx",     subs: "3.7K",  niche: "Travel",       color: "#10B981" },
  { initial: "K", name: "KimCodes",     subs: "455K",  niche: "Dev",          color: "#EC4899" },
  { initial: "E", name: "elias.invest", subs: "51K",   niche: "Finance",      color: "#6366F1" },
  { initial: "C", name: "ChloeVlogs",   subs: "138K",  niche: "Lifestyle",    color: "#14B8A6" },
  { initial: "Y", name: "YukiMedia",    subs: "1.8M",  niche: "Gaming",       color: "#FB7185" },
  { initial: "O", name: "OwenOnTopic",  subs: "12K",   niche: "Business",     color: "#84CC16" },
  { initial: "H", name: "hana.reviews", subs: "507K",  niche: "Tech Reviews", color: "#FBBF24" },
]

// Inline kleuren matchen de Tailwind tokens: secondary = #C0C0C0, muted = #A0A0A0
const COLOR_SECONDARY = "#C0C0C0"
const COLOR_MUTED     = "#A0A0A0"

function CreatorChip({ initial, name, subs, niche, color }: {
  initial: string; name: string; subs: string; niche: string; color: string
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexShrink: 0,
      borderRadius: 9999,
      border: "1px solid #242424",
      backgroundColor: "#181818",
      padding: "10px 16px",
      marginRight: 12,
    }}>
      {/* Avatar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: "50%",
        backgroundColor: color,
        fontSize: 12,
        fontWeight: 700,
        color: "#080808",
        flexShrink: 0,
      }}>
        {initial}
      </div>

      {/* Name + subs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ whiteSpace: "nowrap", fontSize: 13, fontWeight: 600, color: "#F2F2F2", lineHeight: 1 }}>
          {maskUsername(name)}
        </span>
        <span style={{ whiteSpace: "nowrap", fontSize: 12, color: COLOR_SECONDARY, lineHeight: 1 }}>
          {subs} subscribers
        </span>
      </div>

      {/* Niche pill */}
      <span style={{
        whiteSpace: "nowrap",
        borderRadius: 9999,
        border: "1px solid #2a2a2a",
        backgroundColor: "#131313",
        padding: "3px 10px",
        fontSize: 12,
        fontWeight: 500,
        color: COLOR_MUTED,
      }}>
        {niche}
      </span>
    </div>
  )
}

export function CreatorsMarquee({ creatorCount }: { creatorCount: number }) {
  return (
    <section style={{
      backgroundColor: "#050505",
      borderTop: "1px solid #242424",
      padding: "56px 0",
      overflow: "hidden",
    }}>
      <p style={{
        textAlign: "center",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.14em",
        color: COLOR_MUTED,
        textTransform: "uppercase",
        marginBottom: 36,
        padding: "0 24px",
      }}>
        Trusted by {creatorCount.toLocaleString("en-US")}+ YouTube creators worldwide
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Marquee speed={50} gradient={false}>
          {[...row1, ...row1].map((c, i) => <CreatorChip key={i} {...c} />)}
        </Marquee>
        <Marquee speed={42} direction="right" gradient={false}>
          {[...row2, ...row2].map((c, i) => <CreatorChip key={i} {...c} />)}
        </Marquee>
      </div>
    </section>
  )
}
