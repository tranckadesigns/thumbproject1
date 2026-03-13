import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-content-inverse hover:bg-accent-hover",
        secondary:
          "bg-base-elevated border border-border text-content-primary hover:bg-base-overlay hover:border-border-strong",
        ghost:
          "text-content-secondary hover:text-content-primary hover:bg-base-elevated",
        outline:
          "border border-border text-content-primary hover:bg-base-elevated",
        destructive:
          "bg-error/10 border border-error/30 text-error hover:bg-error/20",
        link:
          "text-accent hover:text-accent-hover underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded",
        default: "h-9 px-4 text-sm rounded",
        lg: "h-11 px-6 text-sm rounded",
        xl: "h-12 px-8 text-base rounded",
        icon: "h-9 w-9 rounded",
        "icon-sm": "h-8 w-8 rounded",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
