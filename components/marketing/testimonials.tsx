import { cn } from "@/lib/utils/cn";

// ─── Data ─────────────────────────────────────────────────────────────────────

export const testimonials = [
  {
    quote:
      "I've been using Vaulted for 3 months. My thumbnails went from looking amateur to agency-level. The PSD layers are clean and everything is editable in minutes.",
    name: "Marcus T.",
    handle: "@marcuscreates",
    subscribers: "284K subscribers",
    initials: "MT",
    color: "#C9A96E",
  },
  {
    quote:
      "The revenue notification overlays are exactly what I needed. My CTR jumped from 4.2% to 8.9% after switching to these assets. No other template site comes close.",
    name: "Sophie L.",
    handle: "@sophiemakesvids",
    subscribers: "512K subscribers",
    initials: "SL",
    color: "#818CF8",
  },
  {
    quote:
      "I was spending hours making these overlays from scratch. Now I just swap in the numbers and I'm done in five minutes. Worth every penny of the subscription.",
    name: "Dani R.",
    handle: "@danireviews",
    subscribers: "98K subscribers",
    initials: "DR",
    color: "#34D399",
  },
  {
    quote:
      "These look exactly like real platform notifications — not cheesy mockups. My audience actually thinks the revenue numbers shown in my thumbnails are real screenshots.",
    name: "Jordan K.",
    handle: "@jordankodes",
    subscribers: "1.2M subscribers",
    initials: "JK",
    color: "#FB923C",
  },
  {
    quote:
      "Subscriber milestone templates are insane. I hit 100K and used the Vaulted milestone overlay in my video — that thumbnail got 2.4x my normal CTR. Crazy.",
    name: "Priya M.",
    handle: "@priyamakes",
    subscribers: "134K subscribers",
    initials: "PM",
    color: "#E879F9",
  },
  {
    quote:
      "I manage thumbnails for 4 channels. This library is the only reason I can keep up with the volume. The categories make it fast to find exactly what a video needs.",
    name: "Alex B.",
    handle: "@alexbuilds",
    subscribers: "670K subscribers",
    initials: "AB",
    color: "#60A5FA",
  },
  {
    quote:
      "The Stripe payout overlays look so real. I use them for my 'how I made $X this month' videos and they consistently outperform my other thumbnails.",
    name: "Tomás V.",
    handle: "@tomasvlogs",
    subscribers: "445K subscribers",
    initials: "TV",
    color: "#F472B6",
  },
  {
    quote:
      "Finally a library that understands what YouTube creators actually need. These aren't random UI elements — they're built for thumbnails and it shows.",
    name: "Nina C.",
    handle: "@ninacontent",
    subscribers: "221K subscribers",
    initials: "NC",
    color: "#A78BFA",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 12 12"
          className="h-3 w-3 fill-accent"
        >
          <path d="M6 0l1.5 4H12l-3.7 2.7 1.4 4.3L6 8.4l-3.7 2.6 1.4-4.3L0 4h4.5z" />
        </svg>
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[number];
  className?: string;
}

function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "w-72 flex-shrink-0 rounded-xl border border-border bg-base-elevated p-5",
        className
      )}
    >
      <Stars />
      <p className="mt-3 text-sm leading-relaxed text-content-secondary line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2.5">
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-base"
          style={{ backgroundColor: testimonial.color }}
        >
          {testimonial.initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-content-primary truncate">
            {testimonial.name}
          </p>
          <p className="text-[10px] text-content-muted truncate">
            {testimonial.subscribers}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────

export function TestimonialsSection() {
  // Duplicate for seamless infinite loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="border-t border-border-subtle py-20 overflow-hidden">
      <div className="px-6 mb-10 text-center">
        <p className="mb-3 text-xs font-medium tracking-widest text-content-muted uppercase">
          Trusted by creators
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-content-primary">
          Built for serious thumbnails.
        </h2>
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-base to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-base to-transparent" />

        <div className="flex animate-marquee gap-4">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
