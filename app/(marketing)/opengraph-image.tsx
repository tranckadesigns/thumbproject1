import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0F0F0F",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 3,
            background: "linear-gradient(90deg, transparent 0%, #C9A96E 50%, transparent 100%)",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -200, left: "50%",
            width: 600, height: 500,
            marginLeft: -300,
            background: "radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
          <svg width="30" height="30" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
              fill="#C9A96E"
            />
          </svg>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#C9A96E", letterSpacing: "-1px" }}>PSD</span>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#F2F2F2", letterSpacing: "-1px" }}>fuel</span>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "0 12px",
            fontSize: 68,
            fontWeight: 800,
            color: "#F2F2F2",
            letterSpacing: "-3px",
            lineHeight: 1.05,
            textAlign: "center",
            maxWidth: 900,
            marginBottom: 20,
          }}
        >
          <span>Premium PSD assets for</span>
          <span style={{ color: "#C9A96E" }}>YouTube</span>
          <span>creators</span>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 22,
            color: "#666666",
            textAlign: "center",
            maxWidth: 680,
            marginBottom: 52,
            lineHeight: 1.5,
            letterSpacing: "-0.3px",
          }}
        >
          180+ editable thumbnail overlays · New assets every month · From $19/mo
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 0 }}>
          {[
            ["180+", "PSD assets"],
            ["12", "Categories"],
            ["1,200+", "Creators"],
            ["< 60s", "Edit time"],
          ].map(([val, label], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "0 36px",
                borderLeft: i > 0 ? "1px solid #242424" : "none",
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 700, color: "#C9A96E", letterSpacing: "-1px" }}>{val}</span>
              <span style={{ fontSize: 13, color: "#525252", letterSpacing: "0.05em" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 1,
            background: "rgba(201,169,110,0.12)",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
