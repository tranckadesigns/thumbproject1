import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "#050505",
          borderRadius: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Vertical arm — no borderRadius = hard pixel edges */}
        <div
          style={{
            position: "absolute",
            width: 72,
            height: 460,
            background: "#C9A96E",
          }}
        />
        {/* Horizontal arm — no borderRadius = hard pixel edges */}
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 72,
            background: "#C9A96E",
          }}
        />
        {/* Center overlap square to fill the intersection cleanly */}
        <div
          style={{
            position: "absolute",
            width: 72,
            height: 72,
            background: "#C9A96E",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
