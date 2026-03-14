"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Menu } from "lucide-react";
import { Wordmark } from "@/components/brand/wordmark";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface NavProps {
  isLoggedIn?: boolean;
}

const PROXIMITY = 300;
const BLOB_COUNT = 4;
const BLOB_SIZES = [38, 30, 22, 16];
const BLOB_SPEEDS = [0.14, 0.09, 0.055, 0.03];
const BLOB_PULL = [0, 0.3, 0.65, 0.95];

export function Nav({ isLoggedIn }: NavProps) {
  const pathname = usePathname();
  const btnRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const blobEls = useRef<(HTMLDivElement | null)[]>(Array(BLOB_COUNT).fill(null));
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isNear = useRef(false);
  const opacityVal = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const blobPos = useRef(
    Array.from({ length: BLOB_COUNT }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => { setMounted(true); }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      if (dist < PROXIMITY && !isNear.current) {
        isNear.current = true;
        blobPos.current.forEach(b => { b.x = e.clientX; b.y = e.clientY; });
      } else if (dist >= PROXIMITY && isNear.current) {
        isNear.current = false;
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      const container = containerRef.current;
      const btn = btnRef.current;

      if (container) {
        opacityVal.current = lerp(opacityVal.current, isNear.current ? 1 : 0, 0.07);
        container.style.opacity = String(opacityVal.current);
      }

      let btnCx = mouseX.current;
      let btnCy = mouseY.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        btnCx = rect.left + rect.width / 2;
        btnCy = rect.top + rect.height / 2;
      }

      blobPos.current.forEach((blob, i) => {
        const pull = BLOB_PULL[i];
        const targetX = lerp(mouseX.current, btnCx, pull);
        const targetY = lerp(mouseY.current, btnCy, pull);

        blob.x = lerp(blob.x, targetX, BLOB_SPEEDS[i]);
        blob.y = lerp(blob.y, targetY, BLOB_SPEEDS[i]);

        const el = blobEls.current[i];
        if (el) {
          el.style.transform = `translate(${blob.x}px, ${blob.y}px)`;
        }
      });

      requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "text-sm transition-colors",
        pathname === href
          ? "text-content-primary"
          : "text-content-secondary hover:text-content-primary"
      )}
    >
      {label}
    </Link>
  );

  return (
    <>
      {mounted && createPortal(
        <>
          <svg style={{ position: "fixed", width: 0, height: 0, overflow: "hidden" }}>
            <defs>
              <filter id="nav-gooey">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
                />
              </filter>
            </defs>
          </svg>

          <div
            ref={containerRef}
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 9999,
              opacity: 0,
              filter: "url(#nav-gooey)",
            }}
          >
            {Array.from({ length: BLOB_COUNT }, (_, i) => {
              const size = BLOB_SIZES[i];
              return (
                <div
                  key={i}
                  ref={el => { blobEls.current[i] = el; }}
                  style={{
                    position: "absolute",
                    top: -size / 2,
                    left: -size / 2,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: "rgba(201, 169, 110, 1)",
                    willChange: "transform",
                  }}
                />
              );
            })}
          </div>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-[200] flex flex-col bg-base md:hidden">
              {/* Header */}
              <div className="flex h-14 items-center justify-between border-b border-border px-6">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Wordmark />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-content-muted transition-colors hover:border-border-strong hover:text-content-primary"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex flex-col gap-1 p-4">
                {[
                  { href: "/", label: "Home" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/changelog", label: "Changelog" },
                  ...(isLoggedIn
                    ? [
                        { href: "/library", label: "Library" },
                        { href: "/account", label: "Account" },
                      ]
                    : [
                        { href: "/login", label: "Sign in" },
                      ]
                  ),
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-base-surface text-content-primary"
                        : "text-content-secondary hover:bg-base-surface hover:text-content-primary"
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* CTA */}
              <div className="mt-auto border-t border-border p-6">
                <Link
                  href={isLoggedIn ? "/library" : "/signup"}
                  className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
                >
                  {isLoggedIn ? "Go to library" : "Get access"}
                </Link>
                {!isLoggedIn && (
                  <p className="mt-3 text-center text-xs text-content-muted">
                    Monthly from $19 · Cancel anytime
                  </p>
                )}
              </div>
            </div>
          )}
        </>,
        document.body
      )}

      <header className="sticky top-0 z-50 h-14 w-full border-b border-border-subtle bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex-shrink-0">
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLink("/pricing", "Pricing")}
            {isLoggedIn ? (
              <>
                {navLink("/account", "Account")}
                <Link
                  href="/library"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Library
                </Link>
              </>
            ) : (
              <>
                {navLink("/login", "Sign in")}
                <Link
                  ref={btnRef}
                  href="/signup"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Get access
                </Link>
              </>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-content-muted transition-colors hover:border-border-strong hover:text-content-primary md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>
    </>
  );
}
