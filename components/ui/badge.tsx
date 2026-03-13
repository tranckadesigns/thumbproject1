import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-accent/15 text-accent border border-accent/25",
        secondary:
          "bg-base-elevated text-content-secondary border border-border",
        outline:
          "border border-border text-content-secondary",
        success:
          "bg-success/10 text-success border border-success/25",
        error:
          "bg-error/10 text-error border border-error/25",
        muted:
          "bg-base-overlay text-content-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
