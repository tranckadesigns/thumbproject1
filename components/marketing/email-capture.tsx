"use client"

import { useState } from "react"
import { cn } from "@/lib/utils/cn"
import { buttonVariants } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"

export function EmailCaptureSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="border-t border-border bg-base-surface px-6 py-20">
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-content-muted">
            Not ready yet?
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-content-primary">
            Get 3 free sample PSDs
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-content-secondary">
            See the quality before you commit. Three fully editable assets — no card required.
          </p>
        </Reveal>

        <Reveal delay={80}>
          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-accent">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Check your inbox — samples on their way.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-lg border border-border bg-base-surface px-4 py-2.5 text-sm text-content-primary placeholder:text-content-muted/40 outline-none transition-colors focus:border-accent/50"
              />
              <button
                type="submit"
                className={cn(buttonVariants({ size: "default" }), "shrink-0")}
              >
                Send free samples
              </button>
            </form>
          )}
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-4 text-xs text-content-muted/40">
            No spam. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
