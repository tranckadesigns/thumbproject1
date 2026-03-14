import { Reveal } from "@/components/ui/reveal"

const niches = [
  "Finance",
  "Gaming",
  "Fitness",
  "Tech Reviews",
  "Lifestyle",
  "Business",
  "Education",
  "Entertainment",
  "Cooking",
  "Travel",
  "Personal Dev",
  "Music",
]

const countries = [
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇯🇵", name: "Japan" },
  { flag: "🇧🇷", name: "Brazil" },
  { flag: "🇸🇬", name: "Singapore" },
  { flag: "🇳🇴", name: "Norway" },
  { flag: "🇸🇪", name: "Sweden" },
]

export function CreatorsFromSection() {
  return (
    <section className="border-t border-border bg-base-surface px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mb-8 text-center text-[11px] font-medium tracking-widest text-content-muted uppercase">
            Used by creators across every niche — in 40+ countries
          </p>
        </Reveal>

        {/* Niche pills */}
        <Reveal delay={60}>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {niches.map((niche) => (
              <span
                key={niche}
                className="rounded-full border border-border bg-base-elevated px-3.5 py-1.5 text-xs text-content-muted transition-colors duration-200 hover:border-border-strong hover:text-content-secondary"
              >
                {niche}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Country flags */}
        <Reveal delay={120}>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {countries.map(({ flag, name }) => (
              <div key={name} className="flex items-center gap-1.5" title={name}>
                <span className="text-base leading-none">{flag}</span>
                <span className="text-[11px] text-content-muted/60">{name}</span>
              </div>
            ))}
            <span className="text-[11px] text-content-muted/40">+ many more</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
