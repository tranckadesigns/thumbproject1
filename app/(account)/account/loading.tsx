export default function AccountLoading() {
  return (
    <div className="px-6 py-10 animate-pulse">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="h-6 w-24 rounded bg-base-surface" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-36 rounded-xl border border-border bg-base-surface" />
        ))}
      </div>
    </div>
  );
}
