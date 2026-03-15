"use client";

import { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface DownloadButtonProps {
  assetId: string;
  slug: string;
  className?: string;
}

export function DownloadButton({ assetId, slug, className }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleDownload() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/download/${assetId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Download failed");
      }

      // API streams the file — convert to blob URL so the `download`
      // attribute works natively (same-origin) and no new tab opens.
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${slug}.psd`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Download failed";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  if (status === "error") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {errorMsg || "Download failed"}
        </div>
        <Button size="lg" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className={cn("flex flex-col items-start gap-1.5", className)}>
        <Button size="lg" disabled className="gap-2 pointer-events-none">
          <Download className="h-4 w-4" />
          Downloaded ✓
        </Button>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs text-content-muted underline-offset-2 hover:text-content-secondary hover:underline transition-colors"
        >
          Download again
        </button>
      </div>
    );
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
          Preparing download…
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download PSD
        </>
      )}
    </Button>
  );
}
