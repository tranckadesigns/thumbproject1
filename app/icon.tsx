import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

// Star polygon points derived from the logo path (M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7)
// converted to percentages of the 14×14 viewBox
const STAR =
  "polygon(50% 0%, 59.3% 40.7%, 100% 50%, 59.3% 59.3%, 50% 100%, 40.7% 59.3%, 0% 50%, 40.7% 40.7%)";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 420,
            height: 420,
            background: "#C9A96E",
            clipPath: STAR,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
