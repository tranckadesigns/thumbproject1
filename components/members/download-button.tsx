"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface DownloadButtonProps {
  assetId: string;
  slug: string;
  className?: string;
}

export function DownloadButton({ assetId, slug, className }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleDownload() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/download/${assetId}`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const contentDisposition = res.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch?.[1] ?? `${slug}.psd`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleDownload}
      disabled={status === "loading"}
      className={cn("gap-2", className)}
    >
      {status === "loading" ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Downloading…
        </>
      ) : status === "done" ? (
        <>
          <Download className="h-4 w-4" />
          Downloaded
        </>
      ) : status === "error" ? (
        "Try again"
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download PSD
        </>
      )}
    </Button>
  );
}
