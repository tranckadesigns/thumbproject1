"use client";

import { useState, useEffect } from "react";
import { Download, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { cn } from "@/lib/utils/cn";

interface DownloadButtonProps {
  assetId: string;
  slug: string;
  className?: string;
}

export function DownloadButton({ assetId, slug: _slug, className }: DownloadButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Auto-reset from done back to idle after 2.5s
  useEffect(() => {
    if (status !== "done") return;
    const t = setTimeout(() => setStatus("idle"), 2500);
    return () => clearTimeout(t);
  }, [status]);

  async function handleDownload() {
    if (status === "loading" || status === "done") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/download/${assetId}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (res.status === 403) {
          setStatus("idle");
          setShowUpgrade(true);
          return;
        }
        if (res.status === 404) {
          throw new Error("This asset has no file yet — check back soon.");
        }
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Download failed");
      }

      const { url, filename } = await res.json();

      // Fetch as blob so we can set the download filename regardless of origin
      const fileRes = await fetch(url);
      if (!fileRes.ok) throw new Error("Download failed");
      const blob = await fileRes.blob();
      const objectUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      setStatus("done");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Download failed";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}

      {status === "error" ? (
        <div className={cn("flex flex-col gap-2", className)}>
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {errorMsg || "Download failed"}
          </div>
          <Button size="lg" onClick={handleDownload} className={cn("gap-2", className)}>
            <Download className="h-4 w-4" />
            Try again
          </Button>
        </div>
      ) : (
        <Button
          size="lg"
          onClick={handleDownload}
          disabled={status === "loading" || status === "done"}
          className={cn("gap-2 transition-all", className)}
        >
          {status === "loading" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing download…
            </>
          )}
          {status === "done" && (
            <>
              <Check className="h-4 w-4" />
              Downloaded
            </>
          )}
          {status === "idle" && (
            <>
              <Download className="h-4 w-4" />
              Download PSD
            </>
          )}
        </Button>
      )}
    </>
  );
}
