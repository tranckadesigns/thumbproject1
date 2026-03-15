"use client";

import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CheckoutButton } from "@/components/ui/checkout-button";
import { cn } from "@/lib/utils/cn";

export function MonthlyCheckoutButton({ className }: { className?: string }) {
  return (
    <CheckoutButton
      planId="monthly"
      className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full justify-center", className)}
    >
      Get access
      <ChevronRight className="h-4 w-4" />
    </CheckoutButton>
  );
}

export function YearlyCheckoutButton({ className }: { className?: string }) {
  return (
    <CheckoutButton
      planId="yearly"
      className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full justify-center", className)}
    >
      Get access
      <ChevronRight className="h-4 w-4" />
    </CheckoutButton>
  );
}

export function MonthlyCtaButton() {
  return (
    <CheckoutButton
      planId="monthly"
      className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "mt-5 w-full justify-center")}
    >
      Start monthly
    </CheckoutButton>
  );
}

export function YearlyCtaButton() {
  return (
    <CheckoutButton
      planId="yearly"
      className={cn(buttonVariants({ variant: "default", size: "sm" }), "mt-5 w-full justify-center")}
    >
      Start yearly
    </CheckoutButton>
  );
}
