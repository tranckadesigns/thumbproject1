export function LibrarySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video rounded-xl bg-base-elevated" />
          <div className="mt-3 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-base-elevated" />
            <div className="h-3 w-1/2 rounded bg-base-elevated" />
          </div>
        </div>
      ))}
    </div>
  );
}
