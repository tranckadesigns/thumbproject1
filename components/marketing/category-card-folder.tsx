'use client'

import Image from 'next/image'
import { useState } from 'react'
import { CategoryIcon } from '@/components/marketing/category-icons'

interface Props {
  name: string
  description: string
  previews: string[]
}

// Fan: left / center / right resting positions
const FAN = [
  { rotate: -14, tx: -50, ty:  2, delay:  40 },
  { rotate:   0, tx:   0, ty: -14, delay:   0 },
  { rotate:  14, tx:  50, ty:  2, delay:  80 },
]

export function CategoryCardFolder({ name, description, previews }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ── Card shell — overflow:visible so cards can fan outside bounds ── */}
      <div className="relative overflow-visible" style={{ aspectRatio: '16/9' }}>

        {/* ── Main card (style from A — clean dark card) ───────────────────── */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #0d0d0d 0%, #111111 50%, #181818 100%)',
            border: `1px solid ${open ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: open
              ? '0 8px 36px rgba(201,169,110,0.1), 0 2px 8px rgba(0,0,0,0.4)'
              : '0 2px 8px rgba(0,0,0,0.25)',
            transform: open ? 'scale(1.015)' : 'scale(1)',
            transition: 'border-color 0.32s, box-shadow 0.4s, transform 0.4s cubic-bezier(0.34,1.3,0.64,1)',
          }}
        >
          {/* Top accent line — sweeps in */}
          <div
            className="absolute left-0 right-0 top-0 h-[1.5px] origin-left"
            style={{
              background: 'linear-gradient(to right, transparent 0%, rgba(201,169,110,0.6) 40%, rgba(201,169,110,0.6) 60%, transparent 100%)',
              transform: open ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1) 30ms',
            }}
          />

          {/* Category icon — fades out when open */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: open ? 0 : 1,
              transform: open ? 'scale(0.88) translateY(-4px)' : 'scale(1) translateY(0)',
              transition: 'opacity 0.18s ease-out, transform 0.22s ease-out',
            }}
          >
            <CategoryIcon name={name} />
          </div>
        </div>

        {/* ── Ambient glow below card ───────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '65%',
            height: 10,
            borderRadius: '50%',
            background: 'rgba(201,169,110,0.2)',
            filter: 'blur(10px)',
            opacity: open ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
          }}
        />

        {/* ── Fanned asset cards ────────────────────────────────────────────── */}
        {Array.from({ length: 3 }).map((_, i) => {
          const f   = FAN[i]
          const url = previews[i]

          return (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: '36%',
                top: '50%',
                left: '50%',
                zIndex: 10 + i,
                transform: open
                  ? `translate(calc(-50% + ${f.tx}px), calc(-50% + ${f.ty}px)) rotate(${f.rotate}deg) scale(1)`
                  : 'translate(-50%, -50%) rotate(0deg) scale(0.55)',
                opacity: open ? 1 : 0,
                transition: open
                  ? `transform 0.48s cubic-bezier(0.34,1.48,0.64,1) ${f.delay}ms, opacity 0.28s ease-out ${f.delay}ms`
                  : 'transform 0.22s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease-out',
              }}
            >
              <div
                className="relative aspect-video w-full overflow-hidden rounded-[5px]"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.65)',
                }}
              >
                {url ? (
                  <Image
                    src={url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 150px, 110px"
                    quality={90}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #252525 50%, #1a1a1a 100%)' }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Text ─────────────────────────────────────────────────────────── */}
      <div className="mt-2.5">
        <p className="text-sm font-semibold text-content-primary">{name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-content-muted/70">{description}</p>
      </div>
    </div>
  )
}
