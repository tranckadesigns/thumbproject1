import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0F0F0F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 4-pointed star spark — same as logo mark */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
            fill="#C9A96E"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
