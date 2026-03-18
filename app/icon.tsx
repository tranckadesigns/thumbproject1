import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          background: "#050505",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Horizontal arm */}
        <div
          style={{
            position: "absolute",
            width: 54,
            height: 16,
            background: "#C9A96E",
            borderRadius: "50%",
          }}
        />
        {/* Vertical arm */}
        <div
          style={{
            position: "absolute",
            width: 16,
            height: 54,
            background: "#C9A96E",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
