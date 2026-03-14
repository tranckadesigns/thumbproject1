"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

const SCALE = 2.4;

interface ZoomablePreviewProps {
  src: string;
  alt: string;
}

export function ZoomablePreview({ src, alt }: ZoomablePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ px: number; py: number } | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      px: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      py: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    });
  }, []);

  const transform = pos
    ? `scale(${SCALE}) translate(${(0.5 - pos.px) * 100}%, ${(0.5 - pos.py) * 100}%)`
    : "scale(1) translate(0%, 0%)";

  return (
    <div
      ref={containerRef}
      className="group relative overflow-hidden rounded-xl border border-border bg-base-elevated aspect-[16/10] cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos(null)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />

      {/* Zoomable image layer */}
      <div
        className="absolute inset-0"
        style={{
          transform,
          transition: pos ? "transform 55ms linear" : "transform 250ms ease-out",
          willChange: "transform",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-8"
          style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.6))" }}
          unoptimized
          priority
        />
      </div>

      {/* Hover hint — fades out when zoomed */}
      <div
        className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-border/50 bg-base/75 px-2.5 py-1.5 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: pos ? 0 : 1 }}
      >
        <ZoomIn className="h-3 w-3 text-content-muted" />
        <span className="text-[11px] leading-none text-content-muted">Hover to zoom</span>
      </div>
    </div>
  );
}
