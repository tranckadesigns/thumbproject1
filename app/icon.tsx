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
        {/* Horizontal arm — wide ellipse = pointed left/right tips */}
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 110,
            background: "#C9A96E",
            borderRadius: "50%",
          }}
        />
        {/* Vertical arm — tall ellipse = pointed top/bottom tips */}
        <div
          style={{
            position: "absolute",
            width: 110,
            height: 460,
            background: "#C9A96E",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
