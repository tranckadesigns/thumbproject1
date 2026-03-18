"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MAX_MB = 2;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string;
  initials: string;
}

export function AvatarUpload({ userId, currentUrl, initials }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleFile(file: File) {
    setError(null);

    if (!ALLOWED.includes(file.type)) {
      setError("Only JPG, PNG, or WebP allowed.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Max ${MAX_MB}MB.`);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    startTransition(async () => {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError("Upload failed. Please try again.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: url },
      });

      if (updateError) {
        setError("Could not save avatar. Please try again.");
        return;
      }

      setPreview(url);
      // Refresh session so the updated user metadata is written to cookies
      // before router.refresh() re-renders the server layout (AppNav).
      await supabase.auth.refreshSession();
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-border transition-colors hover:border-accent/50 disabled:opacity-60"
        aria-label="Change profile photo"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Profile photo"
            fill
            sizes="64px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-accent/20 text-sm font-semibold text-accent">
            {initials}
          </div>
        )}

        {/* Camera overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="h-5 w-5 text-white" />
        </div>

        {/* Spinner while uploading */}
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </button>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="text-sm text-content-secondary underline-offset-2 hover:text-content-primary hover:underline disabled:opacity-50 transition-colors"
        >
          {isPending ? "Uploading…" : "Change photo"}
        </button>
        <p className="mt-0.5 text-xs text-content-muted">JPG, PNG or WebP · max 2MB</p>
        {error && <p className="mt-0.5 text-xs text-red-400">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
