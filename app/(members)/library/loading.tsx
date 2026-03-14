export default function LibraryLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 animate-pulse">
      <div className="mb-6 space-y-2">
        <div className="h-5 w-24 rounded bg-base-surface" />
        <div className="h-3 w-48 rounded bg-base-surface" />
      </div>
      <div className="mb-6 h-10 rounded-xl bg-base-surface" />
      <div className="flex gap-10">
        <div className="hidden w-44 shrink-0 space-y-2 lg:block">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-8 rounded-lg bg-base-surface" />)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video rounded-xl bg-base-surface" />
                <div className="h-3 w-3/4 rounded bg-base-surface" />
                <div className="h-3 w-1/2 rounded bg-base-surface" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
