import { Layers, Maximize2, Box, Shield, Paintbrush, CalendarPlus } from 'lucide-react'
import { Reveal } from '@/components/ui/reveal'

const specs = [
  {
    icon: Maximize2,
    value: '4K resolution',
    label: 'Ultra HD quality, every file',
  },
  {
    icon: Layers,
    value: '8–16 named layers',
    label: 'Every element fully separated',
  },
  {
    icon: Box,
    value: 'Smart Objects',
    label: 'Scale without quality loss',
  },
  {
    icon: Shield,
    value: 'Commercial license',
    label: 'Clients, sponsors & agencies',
  },
  {
    icon: Paintbrush,
    value: 'Photoshop CC+',
    label: 'No plugins required',
  },
  {
    icon: CalendarPlus,
    value: '+3–4 per month',
    label: 'New assets, auto-included',
  },
]

export function FileSpecsSection() {
  return (
    <section className="border-t border-border bg-base-surface px-6 py-24">
      <div className="mx-auto max-w-5xl">

        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              Built right
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Professional grade.
              <br />Every file.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-content-secondary">
              Every asset ships to the same production standard — the kind
              professional thumbnail designers charge for individually.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map(({ icon: Icon, value, label }, i) => (
            <Reveal key={value} delay={i * 60} className="h-full">
              <div className="flex h-full items-center gap-4 rounded-xl border border-border bg-base-elevated px-5 py-4 transition-colors duration-300 hover:border-accent/20">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-base-surface">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-content-primary">{value}</p>
                  <p className="mt-0.5 text-xs text-content-muted">{label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  )
}
