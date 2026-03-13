import { cn } from "@/lib/utils/cn";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function Wordmark({ className, size = "default" }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-semibold tracking-widest text-content-primary",
        {
          "text-xs": size === "sm",
          "text-sm": size === "default",
          "text-2xl": size === "lg",
        },
        className
      )}
    >
      VAULTED
    </span>
  );
}
