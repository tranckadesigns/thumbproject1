"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// Module-level singleton state — works across all components
let _listeners: Array<(toasts: Toast[]) => void> = [];
let _toasts: Toast[] = [];
let _nextId = 0;

export function showToast(message: string, type: ToastType = "success") {
  const id = _nextId++;
  _toasts = [..._toasts, { id, message, type }];
  _listeners.forEach((l) => l(_toasts));

  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id);
    _listeners.forEach((l) => l(_toasts));
  }, 3200);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    _listeners.push(setToasts);
    return () => {
      _listeners = _listeners.filter((l) => l !== setToasts);
    };
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-sm pointer-events-auto",
            t.type === "success"
              ? "border-emerald-500/20 bg-[#111] text-emerald-400"
              : "border-red-500/20 bg-[#111] text-red-400"
          )}
        >
          {t.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="text-content-primary">{t.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}
