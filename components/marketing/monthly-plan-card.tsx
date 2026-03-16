'use client'

import { useRef } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CheckoutButton } from '@/components/ui/checkout-button'
import { cn } from '@/lib/utils/cn'
import { siteConfig } from '@/lib/config/site'

export function MonthlyPlanCard({ assetCount, categoryCount }: { assetCount: number; categoryCount: number }) {
  const planFeatures = [
    `Full library — all ${assetCount}+ assets`,
    `All ${categoryCount} categories included`,
    'Fully layered Adobe Photoshop PSD',
    'Commercial license included',
    'New assets added every month',
    'Unlimited downloads, no credits',
  ]
  const plan = siteConfig.plans.monthly
  const btnRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const btn = btnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    const proximity = 180

    if (dist < proximity) {
      const pull = 1 - dist / proximity
      btn.style.transform = `translate(${dx * 0.15 * pull}px, ${dy * 0.15 * pull}px)`
    } else {
      btn.style.transform = 'translate(0px, 0px)'
    }
  }

  const handleMouseLeave = () => {
    const btn = btnRef.current
    if (!btn) return
    btn.style.transform = 'translate(0px, 0px)'
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex flex-col rounded-xl border border-border bg-base-surface overflow-hidden transition-colors"
    >
      <div className="p-8">
        <p className="mb-1 text-xs font-medium tracking-widest text-content-muted uppercase">
          {plan.label}
        </p>

        <div className="flex items-end gap-1.5">
          <span className="text-4xl font-semibold tracking-tighter text-content-primary">
            ${plan.price}
          </span>
          <span className="mb-1 text-sm text-content-muted">/{plan.interval}</span>
        </div>

        <div className="mt-2 space-y-0.5">
          <p className="text-sm text-content-secondary">Flexible month-to-month.</p>
          <p className="text-xs text-content-muted">Cancel anytime.</p>
        </div>

        {/* Magnetic button */}
        <div
          ref={btnRef}
          style={{
            transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          className="mt-7"
        >
          <CheckoutButton
            planId="monthly"
            className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }), 'w-full justify-center')}
          >
            Get access
            <ChevronRight className="h-4 w-4" />
          </CheckoutButton>
        </div>
      </div>

      {/* Feature list */}
      <div className="border-t border-border/60 px-8 pb-8 pt-6">
        <ul className="space-y-3">
          {planFeatures.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-accent/15">
                <Check className="h-2.5 w-2.5 text-accent" />
              </div>
              <span className="text-sm text-content-secondary">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
