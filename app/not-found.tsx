import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh]"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,0.07) 0%, transparent 100%)",
        }}
      />

      <div className="relative">
        <p
          className="select-none text-[9rem] font-bold leading-none tracking-tighter"
          style={{
            background:
              "linear-gradient(180deg, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.04) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </p>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="mb-5 opacity-60"
          >
            <path
              d="M7 0 L8.3 5.7 L14 7 L8.3 8.3 L7 14 L5.7 8.3 L0 7 L5.7 5.7 Z"
              fill="#C9A96E"
            />
          </svg>
          <h1 className="text-2xl font-semibold tracking-tight text-content-primary">
            Page not found
          </h1>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-content-secondary">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Link
          href="/"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Back to home
        </Link>
        <Link
          href="/library"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Browse library
        </Link>
      </div>
    </div>
  );
}
