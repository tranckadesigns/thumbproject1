"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function NavProgress() {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Listen for link clicks to start the bar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element).closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;
      // Don't start for same-page links
      const dest = href.split("?")[0];
      const curr = window.location.pathname;
      if (dest === curr) return;

      clearTimeout(timerRef.current);
      setVisible(true);
      setWidth(12);

      // Ease toward 75% while waiting for navigation
      let w = 12;
      function tick() {
        w = w + (75 - w) * 0.12;
        setWidth(w);
        if (w < 74) timerRef.current = setTimeout(tick, 80);
      }
      timerRef.current = setTimeout(tick, 80);
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      clearTimeout(timerRef.current);
    };
  }, []);

  // When navigation completes, fill to 100% then fade out
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;
    clearTimeout(timerRef.current);
    setWidth(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 380);
    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] bg-accent"
      style={{
        width: `${width}%`,
        opacity: visible ? 1 : 0,
        transition: visible
          ? "width 0.15s ease, opacity 0.3s ease"
          : "opacity 0.3s ease",
      }}
    />
  );
}
