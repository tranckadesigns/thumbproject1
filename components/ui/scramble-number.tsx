"use client";

import { useState, useRef } from "react";

interface ScrambleNumberProps {
  value: number;
  className?: string;
}

export function ScrambleNumber({ value, className }: ScrambleNumberProps) {
  const formatted = value.toLocaleString();
  const [display, setDisplay] = useState(formatted);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  function scramble() {
    let frame = 0;
    const totalFrames = 10;
    intervalRef.current = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        clearInterval(intervalRef.current);
        setDisplay(formatted);
        return;
      }
      setDisplay(
        formatted.replace(/\d/g, () => String(Math.floor(Math.random() * 10)))
      );
    }, 30);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setDisplay(formatted);
  }

  return (
    <span
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={stop}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {display}
    </span>
  );
}
