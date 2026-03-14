"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

const LENS_SIZE = 168;
const ZOOM = 2.8;

interface ZoomablePreviewProps {
  src: string;
  alt: string;
}

export function ZoomablePreview({ src, alt }: ZoomablePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number; px: number; py: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLens({
      x,
      y,
      px: Math.max(0, Math.min(1, x / rect.width)),
      py: Math.max(0, Math.min(1, y / rect.height)),
    });
  }, []);

  const handleMouseLeave = useCallback(() => setLens(null), []);

  // Clamp lens so it doesn't overflow the container edges
  const lensLeft = lens ? Math.max(0, Math.min((containerRef.current?.offsetWidth ?? 9999) - LENS_SIZE, lens.x - LENS_SIZE / 2)) : 0;
  const lensTop  = lens ? Math.max(0, Math.min((containerRef.current?.offsetHeight ?? 9999) - LENS_SIZE, lens.y - LENS_SIZE / 2)) : 0;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10] cursor-none select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />

      {/* Main image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-8"
        style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.6))" }}
        unoptimized
      />

      {/* Zoom hint — fades out on hover */}
      <div
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-border/50 bg-base/70 px-2.5 py-1.5 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: lens ? 0 : 1 }}
      >
        <ZoomIn className="h-3 w-3 text-content-muted" />
        <span className="text-[11px] leading-none text-content-muted">Hover to zoom</span>
      </div>

      {/* Magnifier lens */}
      {lens && (
        <div
          className="pointer-events-none absolute z-20 rounded-full overflow-hidden"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: lensLeft,
            top: lensTop,
            boxShadow:
              "0 0 0 1.5px rgba(201,169,110,0.45), 0 0 0 3px rgba(201,169,110,0.12), 0 12px 40px rgba(0,0,0,0.85)",
          }}
        >
          {/* Zoomed image via CSS background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${ZOOM * 100}% ${ZOOM * 100}%`,
              backgroundPosition: `${lens.px * 100}% ${lens.py * 100}%`,
              backgroundRepeat: "no-repeat",
              backgroundColor: "#0f0f0f",
            }}
          />

          {/* Inner vignette for depth */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Crosshair center dot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="h-1 w-1 rounded-full"
              style={{ background: "rgba(201,169,110,0.7)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
