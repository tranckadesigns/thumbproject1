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
        }}
      >
        {/* Sharp 4-pointed star via SVG polygon */}
        <svg
          width="420"
          height="420"
          viewBox="0 0 420 420"
        >
          <polygon
            points="210,0 269,151 420,210 269,269 210,420 151,269 0,210 151,151"
            fill="#C9A96E"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
