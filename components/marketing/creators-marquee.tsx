"use client"

import Marquee from "react-fast-marquee"

const row1 = [
  { initial: "M", name: "MarkB****",   subs: "1.2M", niche: "Business",     color: "#C9A96E" },
  { initial: "S", name: "Sophie****",  subs: "512K", niche: "Lifestyle",    color: "#F472B6" },
  { initial: "J", name: "Jordan****",  subs: "2.4M", niche: "Tech",         color: "#818CF8" },
  { initial: "N", name: "NinaL****",   subs: "430K", niche: "Gaming",       color: "#34D399" },
  { initial: "T", name: "Tyler****",   subs: "89K",  niche: "Finance",      color: "#FB923C" },
  { initial: "A", name: "AriaTe****",  subs: "670K", niche: "Tech Reviews", color: "#38BDF8" },
  { initial: "L", name: "LenaFi****",  subs: "215K", niche: "Fitness",      color: "#4ADE80" },
  { initial: "R", name: "RyanRe****",  subs: "340K", niche: "Education",    color: "#A78BFA" },
]

const row2 = [
  { initial: "P", name: "Priya****",   subs: "178K", niche: "Cooking",      color: "#F59E0B" },
  { initial: "D", name: "DiegoT****",  subs: "93K",  niche: "Travel",       color: "#10B981" },
  { initial: "K", name: "KimKo****",   subs: "455K", niche: "Dev",          color: "#EC4899" },
  { initial: "E", name: "EliasIn****", subs: "720K", niche: "Finance",      color: "#6366F1" },
  { initial: "C", name: "Chloe****",   subs: "138K", niche: "Lifestyle",    color: "#14B8A6" },
  { initial: "Y", name: "YukiG****",   subs: "1.8M", niche: "Gaming",       color: "#FB7185" },
  { initial: "O", name: "OwenOn****",  subs: "261K", niche: "Business",     color: "#84CC16" },
  { initial: "H", name: "HanaRe****",  subs: "507K", niche: "Tech Reviews", color: "#FBBF24" },
]

function CreatorChip({ initial, name, subs, niche, color }: {
  initial: string; name: string; subs: string; niche: string; color: string
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, borderRadius: 9999, border: "1px solid #242424", backgroundColor: "#161616", padding: "10px 16px", marginRight: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "50%", backgroundColor: color, fontSize: 11, fontWeight: 700, color: "#080808", flexShrink: 0 }}>
        {initial}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ whiteSpace: "nowrap", fontSize: 13, fontWeight: 500, color: "#F2F2F2" }}>{name}</span>
        <span style={{ whiteSpace: "nowrap", fontSize: 11, color: "#525252" }}>{subs}</span>
      </div>
      <span style={{ whiteSpace: "nowrap", borderRadius: 9999, border: "1px solid #242424", backgroundColor: "#0F0F0F", padding: "2px 8px", fontSize: 10, color: "#525252" }}>
        {niche}
      </span>
    </div>
  )
}

export function CreatorsMarquee() {
  return (
    <section style={{ borderTop: "1px solid #242424", backgroundColor: "#0F0F0F", padding: "56px 0", overflow: "hidden" }}>
      <p style={{ textAlign: "center", fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", color: "#525252", textTransform: "uppercase", marginBottom: 32, padding: "0 24px" }}>
        Trusted by 1,200+ YouTube creators worldwide
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Marquee speed={60} gradient={false}>
          {[...row1, ...row1].map((c, i) => <CreatorChip key={i} {...c} />)}
        </Marquee>
        <Marquee speed={50} direction="right" gradient={false}>
          {[...row2, ...row2].map((c, i) => <CreatorChip key={i} {...c} />)}
        </Marquee>
      </div>
    </section>
  )
}
