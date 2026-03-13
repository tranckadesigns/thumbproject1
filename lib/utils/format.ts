export function formatFileSize(mb: number): string {
  if (mb < 1) return `${Math.round(mb * 1000)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPlanInterval(interval: "month" | "year"): string {
  return interval === "month" ? "/mo" : "/yr";
}
