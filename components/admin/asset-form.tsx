"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, Loader2, FileArchive } from "lucide-react";
import type { Asset, AssetCategory, PlatformType, StyleType } from "@/types/asset";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils/cn";

const PLATFORMS: PlatformType[] = ["YouTube", "General"];
const STYLES: StyleType[] = ["Dark", "Light", "Minimal", "Bold", "Clean"];

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-content-primary">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-content-muted">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-base-elevated px-3 py-2 text-sm text-content-primary placeholder:text-content-muted/50 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors";

const selectClass =
  "w-full rounded-lg border border-border bg-base-elevated px-3 py-2 text-sm text-content-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors";

export function AssetForm({ asset }: { asset?: Asset }) {
  const router = useRouter();
  const isEdit = !!asset;

  const [title, setTitle] = useState(asset?.title ?? "");
  const [slug, setSlug] = useState(asset?.slug ?? "");
  const [shortDesc, setShortDesc] = useState(asset?.short_description ?? "");
  const [fullDesc, setFullDesc] = useState(asset?.full_description ?? "");
  const [category, setCategory] = useState<AssetCategory>(
    asset?.category ?? "Revenue"
  );
  const [platform, setPlatform] = useState<PlatformType>(
    asset?.platform_type ?? "YouTube"
  );
  const [style, setStyle] = useState<StyleType>(asset?.style_type ?? "Dark");
  const [tags, setTags] = useState(asset?.tags.join(", ") ?? "");
  const [version, setVersion] = useState(asset?.version ?? "1.0");
  const [isPublished, setIsPublished] = useState(asset?.is_published ?? false);
  const [isFeatured, setIsFeatured] = useState(asset?.is_featured ?? false);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    asset?.thumbnail_url ?? ""
  );
  const [psdFile, setPsdFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const thumbnailRef = useRef<HTMLInputElement>(null);
  const psdRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!isEdit) setSlug(toSlug(v));
  };

  const handleThumbnail = (file: File) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("slug", slug);
    fd.append("short_description", shortDesc);
    fd.append("full_description", fullDesc);
    fd.append("category", category);
    fd.append("platform_type", platform);
    fd.append("style_type", style);
    fd.append("tags", tags);
    fd.append("version", version);
    fd.append("is_published", String(isPublished));
    fd.append("is_featured", String(isFeatured));
    if (thumbnailFile) fd.append("thumbnail", thumbnailFile);
    if (psdFile) fd.append("psd", psdFile);

    const url = isEdit
      ? `/api/admin/assets/${asset.id}`
      : "/api/admin/assets";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, { method, body: fd });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push("/admin/assets");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-7">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ── Core info ──────────────────────────────────────────────── */}
      <div className="space-y-5 rounded-xl border border-border bg-base-surface p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
          Core info
        </p>

        <Field label="Title" required>
          <input
            className={inputClass}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="YouTube Revenue Alert"
            required
          />
        </Field>

        <Field label="Slug" required hint="Auto-generated. Edit if needed.">
          <input
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="youtube-revenue-alert"
            required
          />
        </Field>

        <Field label="Short description" required>
          <input
            className={inputClass}
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="One-line summary shown in library cards."
            required
          />
        </Field>

        <Field label="Full description">
          <textarea
            className={cn(inputClass, "min-h-[100px] resize-y")}
            value={fullDesc}
            onChange={(e) => setFullDesc(e.target.value)}
            placeholder="Detailed description shown on the asset detail page."
          />
        </Field>
      </div>

      {/* ── Classification ─────────────────────────────────────────── */}
      <div className="space-y-5 rounded-xl border border-border bg-base-surface p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
          Classification
        </p>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Category" required>
            <select
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value as AssetCategory)}
            >
              {siteConfig.categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Platform">
            <select
              className={selectClass}
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformType)}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Style">
            <select
              className={selectClass}
              value={style}
              onChange={(e) => setStyle(e.target.value as StyleType)}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Tags"
          hint="Comma-separated. e.g. youtube, revenue, earnings"
        >
          <input
            className={inputClass}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="youtube, revenue, earnings"
          />
        </Field>

        <Field label="Version">
          <input
            className={cn(inputClass, "w-28")}
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0"
          />
        </Field>
      </div>

      {/* ── Files ──────────────────────────────────────────────────── */}
      <div className="space-y-5 rounded-xl border border-border bg-base-surface p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
          Files
        </p>

        {/* Thumbnail */}
        <Field
          label="Thumbnail image"
          hint="PNG or JPG. Shown as preview in the library. Recommended: 1280×720."
        >
          <input
            ref={thumbnailRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleThumbnail(f);
            }}
          />
          {thumbnailPreview ? (
            <div className="relative w-full overflow-hidden rounded-lg border border-border">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                width={640}
                height={360}
                className="w-full object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => {
                  setThumbnailFile(null);
                  setThumbnailPreview("");
                }}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-base/80 text-content-muted hover:text-content-primary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => thumbnailRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-content-muted transition-colors hover:border-accent/40 hover:text-content-secondary"
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm">Click to upload thumbnail</span>
            </button>
          )}
        </Field>

        {/* PSD */}
        <Field label="PSD file" hint="The layered Photoshop file subscribers will download.">
          <input
            ref={psdRef}
            type="file"
            accept=".psd,.psb"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setPsdFile(f);
            }}
          />
          {psdFile ? (
            <div className="flex items-center justify-between rounded-lg border border-border bg-base-elevated px-4 py-3">
              <div className="flex items-center gap-3">
                <FileArchive className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-medium text-content-primary">
                    {psdFile.name}
                  </p>
                  <p className="text-xs text-content-muted">
                    {(psdFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPsdFile(null)}
                className="text-content-muted hover:text-content-primary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => psdRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-content-muted transition-colors hover:border-accent/40 hover:text-content-secondary"
            >
              <FileArchive className="h-5 w-5" />
              <span className="text-sm">
                {isEdit && asset.psd_file_key
                  ? `Replace PSD (current: ${asset.psd_file_key})`
                  : "Click to upload PSD file"}
              </span>
            </button>
          )}
        </Field>
      </div>

      {/* ── Visibility ─────────────────────────────────────────────── */}
      <div className="space-y-4 rounded-xl border border-border bg-base-surface p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
          Visibility
        </p>

        <label className="flex cursor-pointer items-center justify-between">
          <div>
            <p className="text-sm font-medium text-content-primary">
              Published
            </p>
            <p className="text-xs text-content-muted">
              Visible in the library to subscribers
            </p>
          </div>
          <div
            onClick={() => setIsPublished((v) => !v)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              isPublished ? "bg-accent" : "bg-base-overlay border border-border"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                isPublished ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </div>
        </label>

        <label className="flex cursor-pointer items-center justify-between">
          <div>
            <p className="text-sm font-medium text-content-primary">Featured</p>
            <p className="text-xs text-content-muted">
              Shown in featured sections on homepage and dashboard
            </p>
          </div>
          <div
            onClick={() => setIsFeatured((v) => !v)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              isFeatured ? "bg-accent" : "bg-base-overlay border border-border"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                isFeatured ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </div>
        </label>
      </div>

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create asset"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/assets")}
          className="rounded-lg px-5 py-2.5 text-sm text-content-muted transition-colors hover:text-content-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
