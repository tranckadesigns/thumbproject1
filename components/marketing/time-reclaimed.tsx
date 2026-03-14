import { Reveal } from '@/components/ui/reveal'

export function TimeReclaimedSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">

        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Your time back
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Stop spending hours on
              <br />what takes seconds.
            </h2>
          </div>
        </Reveal>

        {/* Two stat cards */}
        <Reveal delay={80}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Without */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-base-surface p-8">
              <p className="text-xs font-medium uppercase tracking-widest text-content-muted">
                Without Vaulted
              </p>
              <p className="text-[72px] font-bold leading-none tracking-tighter text-content-muted/40">
                2h+
              </p>
              <p className="text-sm text-content-muted">
                Per thumbnail — finding references, rebuilding in Photoshop, aligning everything from scratch.
              </p>
            </div>

            {/* With Vaulted */}
            <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-accent/30 bg-base-surface p-8"
              style={{ boxShadow: '0 0 40px rgba(201,169,110,0.08)' }}>
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)' }}
              />
              <p className="relative text-xs font-medium uppercase tracking-widest text-accent">
                With Vaulted
              </p>
              <p className="relative text-[72px] font-bold leading-none tracking-tighter text-accent">
                &lt;60s
              </p>
              <p className="relative text-sm text-content-secondary">
                Open the PSD, click the text layer, type your number, export. Done before the render finishes.
              </p>
            </div>

          </div>
        </Reveal>

        {/* Scale calculation */}
        <Reveal delay={160}>
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border sm:grid-cols-3">
            {[
              { value: '3×', label: 'videos per week, on average' },
              { value: '2h+', label: 'spent per thumbnail without Vaulted' },
              { value: '24h+', label: 'saved every month with Vaulted' },
            ].map(({ value, label }, i) => (
              <div key={i} className="flex flex-col gap-1.5 bg-base-surface px-7 py-5">
                <p className="text-2xl font-bold tracking-tight text-content-primary">{value}</p>
                <p className="text-xs leading-relaxed text-content-muted">{label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-center text-xs text-content-muted/50">
            That&apos;s three full work days back in your schedule. Every single month.
          </p>
        </Reveal>

      </div>
    </section>
  )
}
