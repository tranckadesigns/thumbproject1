"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

const LENS = 172;   // lens diameter px
const ZOOM = 2.6;   // zoom factor

interface ZoomablePreviewProps {
  src: string;
  alt: string;
}

export function ZoomablePreview({ src, alt }: ZoomablePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const cW = containerRef.current?.offsetWidth  ?? 0;
  const cH = containerRef.current?.offsetHeight ?? 0;

  // Keep lens fully inside container
  const lensLeft = cursor ? Math.max(0, Math.min(cW - LENS, cursor.x - LENS / 2)) : 0;
  const lensTop  = cursor ? Math.max(0, Math.min(cH - LENS, cursor.y - LENS / 2)) : 0;

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10] cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursor(null)}
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
        priority
      />

      {/* Hint badge */}
      <div
        className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1.5 backdrop-blur-sm transition-opacity duration-150"
        style={{ opacity: cursor ? 0 : 1 }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="text-content-muted">
          <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="7.3" y1="7.3" x2="10" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] leading-none text-content-muted">Hover to zoom</span>
      </div>

      {/* Magnifier lens */}
      {cursor && cW > 0 && (
        <div
          className="pointer-events-none absolute z-30 rounded-full overflow-hidden"
          style={{
            width:  LENS,
            height: LENS,
            left:   lensLeft,
            top:    lensTop,
            border: "1.5px solid rgba(201,169,110,0.5)",
            boxShadow: "0 0 0 0.5px rgba(201,169,110,0.15), 0 8px 32px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Dark base so edges don't bleed */}
          <div className="absolute inset-0 bg-[#0f0f0f]" />

          {/* Zoomed image — pixel-precise: cursor.x * ZOOM lands at LENS/2 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            style={{
              position:  "absolute",
              width:     cW * ZOOM,
              height:    cH * ZOOM,
              left:      LENS / 2 - cursor.x * ZOOM,
              top:       LENS / 2 - cursor.y * ZOOM,
              objectFit: "contain",
              padding:   `${32 * ZOOM}px`,
              pointerEvents: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}
