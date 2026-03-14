'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// ─── Switch between visual styles ─────────────────────────────────────────────
// 1 = Embers    — tiny glowing dots that float upward and drift toward button
// 2 = Sparks    — fast bright streaks, electric/sharp energy feel
// 3 = Mist      — large slow diffuse clouds, ethereal/smoke feel
// 4 = Threads   — long elegant silk-like filaments pulled toward button
// 5 = Stardust  — microscopic shimmering particles, cosmic/ultra-subtle
// 6 = Plasma    — medium particles that shift gold→white as they near the button
const VARIANT: 1 | 2 | 3 | 4 | 5 | 6 = 5

const CONFIGS = {
  1: { // Embers
    maxParticles: 35,
    spawnEvery: 3,
    proximity: 224,
    spawnRadius: [20, 65] as [number, number],
    lifeRange: [80, 130] as [number, number],
    size: () => 1 + Math.random() * 1.8,
    alpha: () => 0.3 + Math.random() * 0.45,
    tangSpeed: () => 0.25 + Math.random() * 0.35,
    outNudge: () => 0.05 + Math.random() * 0.15,
    gravity: (d: number) => Math.min(0.14, 55 / (d * d) * 50),
    antiGravity: 0.018,
    drag: 0.976,
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, _px: number, _py: number, size: number, opacity: number) {
      ctx.save()
      ctx.globalAlpha = opacity * 0.35
      ctx.shadowColor = 'rgba(220, 180, 100, 0.8)'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(x, y, size * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(201, 169, 110, 0.4)'
      ctx.fill()
      ctx.globalAlpha = opacity
      ctx.shadowBlur = 5
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = '#E8D090'
      ctx.fill()
      ctx.restore()
    },
  },

  2: { // Sparks
    maxParticles: 28,
    spawnEvery: 3,
    proximity: 224,
    spawnRadius: [25, 75] as [number, number],
    lifeRange: [50, 90] as [number, number],
    size: () => 0.5 + Math.random() * 0.9,
    alpha: () => 0.4 + Math.random() * 0.5,
    tangSpeed: () => 0.7 + Math.random() * 0.9,
    outNudge: () => 0.15 + Math.random() * 0.35,
    gravity: (d: number) => Math.min(0.22, 80 / (d * d) * 50),
    antiGravity: 0.005,
    drag: 0.965,
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, size: number, opacity: number) {
      const speed = Math.hypot(x - px, y - py)
      const len = Math.max(2, speed * 4.5)
      const angle = Math.atan2(y - py, x - px)
      const x0 = x - Math.cos(angle) * len
      const y0 = y - Math.sin(angle) * len
      ctx.save()
      ctx.globalAlpha = opacity * 0.2
      ctx.strokeStyle = '#FFF5CC'
      ctx.lineWidth = size * 4
      ctx.lineCap = 'round'
      ctx.filter = 'blur(1.5px)'
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke()
      ctx.filter = 'none'
      ctx.globalAlpha = opacity
      ctx.strokeStyle = '#FFFAEE'
      ctx.lineWidth = size
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke()
      ctx.restore()
    },
  },

  3: { // Mist
    maxParticles: 18,
    spawnEvery: 5,
    proximity: 224,
    spawnRadius: [40, 100] as [number, number],
    lifeRange: [140, 200] as [number, number],
    size: () => 8 + Math.random() * 14,
    alpha: () => 0.06 + Math.random() * 0.1,
    tangSpeed: () => 0.15 + Math.random() * 0.2,
    outNudge: () => 0.02 + Math.random() * 0.08,
    gravity: (d: number) => Math.min(0.06, 25 / (d * d) * 50),
    antiGravity: 0.008,
    drag: 0.984,
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, _px: number, _py: number, size: number, opacity: number) {
      ctx.save()
      ctx.globalAlpha = opacity
      ctx.filter = `blur(${size * 0.8}px)`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = '#C9A96E'
      ctx.fill()
      ctx.restore()
    },
  },

  4: { // Threads — long elegant filaments, silk/fiber optic feel
    maxParticles: 22,
    spawnEvery: 3,
    proximity: 224,
    spawnRadius: [20, 70] as [number, number],
    lifeRange: [70, 110] as [number, number],
    size: () => 0.4 + Math.random() * 0.5,
    alpha: () => 0.35 + Math.random() * 0.4,
    tangSpeed: () => 0.5 + Math.random() * 0.6,
    outNudge: () => 0.08 + Math.random() * 0.18,
    gravity: (d: number) => Math.min(0.18, 65 / (d * d) * 50),
    antiGravity: 0.006,
    drag: 0.970,
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, px: number, py: number, size: number, opacity: number) {
      const speed = Math.hypot(x - px, y - py)
      const len = Math.max(4, speed * 9)
      const angle = Math.atan2(y - py, x - px)
      const x0 = x - Math.cos(angle) * len
      const y0 = y - Math.sin(angle) * len
      ctx.save()
      // Soft outer glow — wide and feathered
      ctx.globalAlpha = opacity * 0.12
      ctx.strokeStyle = '#E8D5A0'
      ctx.lineWidth = size * 6
      ctx.lineCap = 'round'
      ctx.filter = 'blur(2px)'
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke()
      // Mid glow
      ctx.filter = 'none'
      ctx.globalAlpha = opacity * 0.3
      ctx.strokeStyle = '#F0E0B0'
      ctx.lineWidth = size * 2.5
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke()
      // Hair-thin bright core
      ctx.globalAlpha = opacity
      ctx.strokeStyle = '#FEFAF0'
      ctx.lineWidth = size * 0.7
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke()
      ctx.restore()
    },
  },

  5: { // Stardust — microscopic shimmering specks, cosmic ultra-subtle feel
    maxParticles: 55,
    spawnEvery: 2,
    proximity: 224,
    spawnRadius: [15, 60] as [number, number],
    lifeRange: [90, 150] as [number, number],
    size: () => 0.4 + Math.random() * 0.8,
    alpha: () => 0.2 + Math.random() * 0.5,
    tangSpeed: () => 0.3 + Math.random() * 0.4,
    outNudge: () => 0.04 + Math.random() * 0.12,
    gravity: (d: number) => Math.min(0.12, 45 / (d * d) * 50),
    antiGravity: 0.01,
    drag: 0.978,
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, _px: number, _py: number, size: number, opacity: number) {
      ctx.save()
      // Soft halo
      ctx.globalAlpha = opacity * 0.25
      ctx.beginPath()
      ctx.arc(x, y, size * 3, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
      grad.addColorStop(0, 'rgba(240, 225, 180, 0.6)')
      grad.addColorStop(1, 'rgba(240, 225, 180, 0)')
      ctx.fillStyle = grad
      ctx.fill()
      // Bright center point
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = '#FFF8E7'
      ctx.shadowColor = 'rgba(255, 235, 160, 0.9)'
      ctx.shadowBlur = 4
      ctx.fill()
      ctx.restore()
    },
  },

  6: { // Plasma — particles shift gold→white as they approach the button
    maxParticles: 25,
    spawnEvery: 3,
    proximity: 224,
    spawnRadius: [25, 70] as [number, number],
    lifeRange: [65, 105] as [number, number],
    size: () => 1.2 + Math.random() * 2,
    alpha: () => 0.3 + Math.random() * 0.4,
    tangSpeed: () => 0.4 + Math.random() * 0.55,
    outNudge: () => 0.06 + Math.random() * 0.16,
    gravity: (d: number) => Math.min(0.16, 60 / (d * d) * 50),
    antiGravity: 0.012,
    drag: 0.972,
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, _px: number, _py: number, size: number, opacity: number, distToTarget?: number) {
      // Color shifts gold → bright white as particle nears button
      const proximity = Math.min(1, Math.max(0, 1 - (distToTarget ?? 200) / 180))
      const r = Math.round(200 + proximity * 55)
      const g = Math.round(165 + proximity * 80)
      const b = Math.round(80 + proximity * 170)
      ctx.save()
      // Outer bloom
      ctx.globalAlpha = opacity * 0.2
      ctx.beginPath()
      ctx.arc(x, y, size * 3.5, 0, Math.PI * 2)
      const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 3.5)
      grad.addColorStop(0, `rgba(${r},${g},${b},0.5)`)
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
      ctx.fillStyle = grad
      ctx.fill()
      // Core
      ctx.globalAlpha = opacity
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.shadowColor = `rgba(${r},${g},${b},0.8)`
      ctx.shadowBlur = 6
      ctx.fill()
      ctx.restore()
    },
  },
}

// ──────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number
  px: number; py: number
  vx: number; vy: number
  size: number; alpha: number
  life: number; maxLife: number
}

const PROXIMITY = 380

export function MagneticLiquid({ targetId }: { targetId: string }) {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cfg = CONFIGS[VARIANT]

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    let mx = -9999, my = -9999
    let particles: Particle[] = []
    let raf: number
    let frame = 0

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)

    const spawn = (tx: number, ty: number): Particle => {
      const a = Math.random() * Math.PI * 2
      const r = cfg.spawnRadius[0] + Math.random() * (cfg.spawnRadius[1] - cfg.spawnRadius[0])
      const px = mx + Math.cos(a) * r
      const py = my + Math.sin(a) * r
      const dx = tx - px, dy = ty - py
      const d = Math.max(Math.hypot(dx, dy), 1)
      const ts = cfg.tangSpeed()
      const tangX = -(dy / d) * ts
      const tangY = (dx / d) * ts
      const on = cfg.outNudge()
      const maxLife = cfg.lifeRange[0] + Math.random() * (cfg.lifeRange[1] - cfg.lifeRange[0])
      return {
        x: px, y: py, px, py,
        vx: tangX - (dx / d) * on,
        vy: tangY - (dy / d) * on,
        size: cfg.size(), alpha: cfg.alpha(),
        life: maxLife, maxLife,
      }
    }

    const tick = () => {
      const target = document.getElementById(targetId)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (target && mx > -999) {
        const rect = target.getBoundingClientRect()
        const tx = rect.left + rect.width / 2
        const ty = rect.top + rect.height / 2
        const mouseDist = Math.hypot(mx - tx, my - ty)
        const pad = 3
        const inBtn = (x: number, y: number) =>
          x > rect.left - pad && x < rect.right + pad &&
          y > rect.top - pad && y < rect.bottom + pad

        const isNear = mouseDist < PROXIMITY
        const onBtn = inBtn(mx, my)

        if (isNear && !onBtn && particles.length < cfg.maxParticles) {
          frame++
          if (frame % cfg.spawnEvery === 0) {
            const spawnChance = Math.pow(1 - mouseDist / PROXIMITY, 2)
            if (Math.random() < spawnChance) particles.push(spawn(tx, ty))
          }
        }

        particles = particles.filter(p => {
          const dx = tx - p.x, dy = ty - p.y
          const d = Math.max(Math.hypot(dx, dy), 1)
          const atEdge = inBtn(p.x, p.y)

          if (!atEdge) {
            const pull = cfg.gravity(d)
            p.vx += (dx / d) * pull
            p.vy += (dy / d) * pull
            p.vy -= cfg.antiGravity
            p.vx *= cfg.drag
            p.vy *= cfg.drag
            p.px = p.x; p.py = p.y
            p.x += p.vx; p.y += p.vy
            p.life -= 1
          } else {
            p.px = p.x; p.py = p.y
            p.life -= 10
          }

          if (p.life <= 0) return false

          const age = p.maxLife - p.life
          const fadeIn = Math.min(1, age / 18)
          const fadeOut = Math.min(1, p.life / 28)
          const opacity = p.alpha * fadeIn * fadeOut

          cfg.draw(ctx, p.x, p.y, p.px, p.py, p.size, opacity, d)
          return true
        })
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [mounted, targetId])

  if (!mounted) return null

  return createPortal(
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />,
    document.body
  )
}
