import { cn } from "@/lib/utils/cn";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function Wordmark({ className, size = "default" }: WordmarkProps) {
  const iconSize = size === "sm" ? 10 : size === "lg" ? 22 : 13;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {/* Icon mark: stylised fuel spark — four-pointed star in accent gold */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
          fill="#C9A96E"
        />
      </svg>

      {/* Wordmark: PSD in accent, fuel in primary */}
      <span
        className={cn("inline-flex items-baseline", {
          "text-[11px]": size === "sm",
          "text-sm": size === "default",
          "text-2xl": size === "lg",
        })}
      >
        <span className="font-bold tracking-tight text-accent">PSD</span>
        <span className="font-semibold tracking-tight text-content-primary">fuel</span>
      </span>
    </span>
  );
}
