'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/ui/reveal'

function CountUp({ to, decimals = 1, suffix = '', duration = 1500 }: {
  to: number; decimals?: number; suffix?: string; duration?: number
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1)
          const e = 1 - Math.pow(1 - p, 3)
          setVal(parseFloat((e * to).toFixed(decimals)))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, decimals, duration])

  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>
}

interface CardProps {
  withOverlay: boolean
  image: string
  title: string
  channel: string
  views: string
  ctr: number
  animated?: boolean
}

function VideoCard({ withOverlay, image, title, channel, views, ctr, animated }: CardProps) {
  return (
    <div className={`flex flex-col rounded-2xl border p-4 ${
      withOverlay
        ? 'border-accent/40 bg-base-surface shadow-[0_0_0_1px_rgba(201,169,110,0.1),0_8px_32px_rgba(201,169,110,0.12)]'
        : 'border-border bg-base-surface'
    }`}>

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#0d0d0d]">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-[3px] flex items-center">
          <span className="text-[11px] font-medium text-white">14:32</span>
        </div>
      </div>

      {/* YouTube metadata */}
      <div className="mt-3 flex gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
          <Image src="/thumbnails/pf-1.jpg" alt={channel} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-content-primary">{title}</p>
          <p className="mt-1 text-xs text-content-muted">{channel} · {views} views · 2 days ago</p>
        </div>
      </div>

      {/* CTR metric */}
      <div className={`mt-4 flex items-center justify-between rounded-xl border px-5 py-4 ${
        withOverlay
          ? 'border-accent/20 bg-accent/[0.04]'
          : 'border-border bg-base-elevated'
      }`}>
        <div>
          <p className="text-xs text-content-muted">Click-through rate</p>
          <p className={`mt-0.5 text-4xl font-bold tracking-tight ${
            withOverlay ? 'text-accent' : 'text-content-secondary'
          }`}>
            {animated
              ? <CountUp to={ctr} decimals={1} suffix="%" duration={1600} />
              : `${ctr.toFixed(1)}%`
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-content-muted">Total views</p>
          <p className={`mt-0.5 text-2xl font-semibold ${
            withOverlay ? 'text-accent' : 'text-content-secondary'
          }`}>
            {animated
              ? <CountUp to={3.1} decimals={1} suffix=" mln." duration={1800} />
              : '28K'
            }
          </p>
        </div>
      </div>

    </div>
  )
}

export function CtrImpactSection() {
  return (
    <section className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-5xl">

        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-4 text-xs font-medium tracking-widest text-content-muted uppercase">
              The performance impact
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-content-primary md:text-4xl">
              Overlays don&apos;t just look good.
              <br />They drive clicks.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-content-secondary">
              Thumbnails with platform-native assets consistently outperform
              plain thumbnails in click-through rate — directly translating to more views.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">

          {/* ── Left: without PSDfuel ── */}
          <Reveal>
            <div>
              <p className="mb-2.5 text-xs font-medium text-content-muted">Without PSDfuel</p>
              <div className="relative">
                {/* Red X badge — top-left corner */}
                <div
                  className="absolute -left-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-base-elevated"
                  style={{ boxShadow: '0 0 12px rgba(239,68,68,0.25), 0 0 24px rgba(239,68,68,0.1)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 2l8 8M10 2l-8 8"
                      stroke="#ef4444"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(239,68,68,0.7))' }}
                    />
                  </svg>
                </div>

                <VideoCard
                  withOverlay={false}
                  image="/thumbnails/ctr-bad.jpg"
                  title="The Laziest Ways To Make $100+/Day Online in 2026"
                  channel="Mark Tilbury"
                  views="28K"
                  ctr={2.3}
                />
              </div>
            </div>
          </Reveal>

          {/* ── Right: with Vaulted — elevated, glowing ── */}
          <Reveal delay={100}>
            <div className="relative">

              {/* Glow behind */}
              <div
                className="pointer-events-none absolute -inset-4 rounded-3xl blur-3xl"
                style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(201,169,110,0.35) 0%, transparent 65%)' }}
              />

              <p className="relative mb-2.5 text-xs font-semibold text-accent">With PSDfuel</p>

              <div className="relative">
                {/* Animated crown — top-right corner */}
                <div
                  className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-base-elevated"
                  style={{
                    animation: 'crownFloat 3s ease-in-out infinite',
                    boxShadow: '0 0 12px rgba(201,169,110,0.4), 0 0 24px rgba(201,169,110,0.15)',
                  }}
                >
                  <svg width="16" height="14" viewBox="0 0 20 17" fill="none">
                    <path
                      d="M2 14h16M2 14L0.5 5l5 4L10 1l4.5 8 5-4L18 14"
                      stroke="#C9A96E"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: 'drop-shadow(0 0 3px rgba(201,169,110,0.8))' }}
                    />
                    <circle cx="2" cy="14.5" r="1.2" fill="#C9A96E" />
                    <circle cx="18" cy="14.5" r="1.2" fill="#C9A96E" />
                    <circle cx="10" cy="14.5" r="1.2" fill="#C9A96E" />
                  </svg>
                </div>

                <style>{`
                  @keyframes crownFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                  }
                `}</style>

                <VideoCard
                  withOverlay
                  image="/thumbnails/ctr-good.jpg"
                  title="The Laziest Ways To Make $100+/Day Online in 2026"
                  channel="Mark Tilbury"
                  views="3,1 mln."
                  ctr={12.4}
                  animated
                />
              </div>
            </div>
          </Reveal>

        </div>

        <Reveal delay={160}>
          <p className="mt-5 text-center text-xs text-content-muted/50">
            Illustrative estimates. Actual CTR varies by niche, audience size, and thumbnail composition.
          </p>
        </Reveal>

      </div>
    </section>
  )
}
