"use client";

import { useRef } from "react";
import Image from "next/image";

interface AssetPreviewTiltProps {
  src: string;
  alt: string;
}

export function AssetPreviewTilt({ src, alt }: AssetPreviewTiltProps) {
  const imgWrapRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = imgWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 16;
    const rotateY = (x - 0.5) * 16;
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.06, 1.06, 1.06)`;
  }

  function onLeave() {
    const el = imgWrapRef.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }

  return (
    <div
      className="absolute inset-0"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d0d] via-[#111] to-[#1a1a1a]" />
      <div
        ref={imgWrapRef}
        className="absolute inset-0"
        style={{
          transition: "transform 0.30s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
    </div>
  );
}
