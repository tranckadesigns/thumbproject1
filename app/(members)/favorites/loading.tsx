export default function FavoritesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 animate-pulse">
      <div className="mb-8 space-y-2">
        <div className="h-6 w-32 rounded bg-base-surface" />
        <div className="h-3 w-48 rounded bg-base-surface" />
      </div>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-video rounded-xl bg-base-surface" />
            <div className="h-3 w-3/4 rounded bg-base-surface" />
            <div className="h-3 w-1/2 rounded bg-base-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
