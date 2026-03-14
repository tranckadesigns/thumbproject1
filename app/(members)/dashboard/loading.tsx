export default function DashboardLoading() {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-10 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-base-surface" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-base-surface" />
            <div className="h-3 w-48 rounded bg-base-surface" />
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-xl border border-border bg-base-surface" />
          ))}
        </div>
        {/* Asset grid */}
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-base-surface" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
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
