"use client";

import { useEffect, useRef } from "react";

export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = ref.current?.parentElement;
    if (!section) return;

    function onMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (ref.current) {
        ref.current.style.background = `radial-gradient(650px circle at ${x}px ${y}px, rgba(201,169,110,0.065) 0%, transparent 60%)`;
      }
    }

    function onLeave() {
      if (ref.current) ref.current.style.background = "none";
    }

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 2 }}
    />
  );
}
