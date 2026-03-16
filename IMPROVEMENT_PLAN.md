# PSDfuel — Improvement Plan
Generated: 2026-03-16
Status tracking for all 10 audit improvements.

All changes are REVERSIBLE (no DB migrations, no destructive ops).

---

## STATUS LEGEND
- [ ] Not started
- [~] In progress
- [x] Done

---

## 1. Founding member progress bar [x]
**What:** Visual X/2,000 progress bar on pricing page under the urgency badge.
Seeded at 1,247 (believable, not round, below cap = urgency).
**Why:** "Locked at $19/mo until 2,000 members" as text only is skepticism-inducing.
A progress bar makes the urgency viscerally real.
**Files:**
- `app/(marketing)/pricing/page.tsx` — add progress bar below existing urgency badge
**Risk:** None. Purely additive.

---

## 2. Non-subscriber upgrade prompt [x]
**What:** When a logged-in user without a subscription clicks "Download PSD",
instead of showing a red error banner saying "Subscription required",
show a premium upgrade modal with value prop + CTA to /pricing.
**Why:** This is the highest-intent conversion moment. A red error destroys the
premium feel and misses the sale. A modal with "Unlock this asset" framing converts.
**Files:**
- `components/ui/upgrade-modal.tsx` — new modal component
- `components/members/download-button.tsx` — detect 403, show modal instead of error
**Risk:** None. Additive to existing error handling.

---

## 3. Dashboard first-session welcome card [x]
**What:** Show a one-time welcome card at the top of the dashboard when the user
has no recently viewed AND no favorites (i.e., brand new member).
Card: "Welcome to PSDfuel. Your library is ready." + CTA to /library.
Dismissed via localStorage key so it only shows once.
**Why:** Currently, a new subscriber's dashboard looks hollow at the top
(recently viewed = hidden, favorites = empty dashed box). The welcome card
fills this gap and provides immediate direction.
**Files:**
- `components/members/welcome-card.tsx` — new "use client" component
- `app/(members)/dashboard/page.tsx` — render WelcomeCard when no activity
**Risk:** None. Additive, localStorage-based dismissal.

---

## 4. Checkout → dashboard onboarding banner [x]
**What:** After successful checkout, the success page redirects to
`/dashboard?welcome=1`. Dashboard detects this param and shows a
one-time welcome banner: "You're in — start exploring your library."
Banner auto-dismisses after 6s or on click.
**Why:** Currently the transition from checkout/success to dashboard is cold.
The user just paid and feels nothing special when they arrive.
**Files:**
- `app/(marketing)/checkout/success/page.tsx` — append ?welcome=1 to dashboard link
- `components/members/onboarding-banner.tsx` — new "use client" banner
- `app/(members)/dashboard/page.tsx` — render OnboardingBanner
**Risk:** None. Additive. Banner is purely client-side.

---

## 5. Renewal date — relative context [x]
**What:** Replace "March 16, 2026" with "Renews in 18 days" (or "Expires in X days"
if cancel_at_period_end). Falls back to the formatted date when > 60 days away.
**Why:** A raw date requires mental math. Relative framing is scannable and
creates gentle awareness of subscription value.
**Files:**
- `components/members/dashboard-greeting.tsx` — add relative date logic
- `app/(members)/dashboard/page.tsx` — pass raw ISO date (or compute there)
**Risk:** None. Pure display change.

---

## 6. Tags — make clickable [x]
**What:** On the asset detail page, each tag pill links to `/library?q={tag}`,
triggering a library search for that tag.
**Why:** Tags look interactive but do nothing. This is a perceived "broken"
element that also misses an easy cross-sell/discovery opportunity.
**Files:**
- `app/(members)/asset/[slug]/page.tsx` — wrap tag spans in Link
**Risk:** None. Pure addition.

---

## 7. Testimonials — remove subscriber counts [x]
**What:** Remove the "284K subscribers", "1.2M subscribers" etc. lines
from all testimonial cards. Keep the name, handle, quote.
**Why:** Specific subscriber counts on fictional testimonials are the #1
thing that makes them look fake to savvy users. Generic "YouTube Creator"
or just name + handle is more believable and still establishes credibility.
**Files:**
- `components/marketing/testimonials.tsx` — remove `subscribers` field from data + card UI
**Risk:** None. Purely removes data.

---

## 8. Copy — remove "overlays" from key hero lines [x]
**What:** In the homepage hero section, change:
"The only library built specifically for YouTube thumbnail overlays."
→ "The only library built specifically for YouTube thumbnails."
And update site description:
"Premium editable PSD thumbnail assets for YouTube creators and designers."
→ already fine, keep.
**Why:** "Overlays" is jargon that only insiders know. "Thumbnails" is what
every creator searches for. The product page has room to explain overlays,
but the hero hook should be maximally broad.
**Files:**
- `app/(marketing)/page.tsx` — update hero subline (one line)
**Risk:** None. One line change.

---

## 9. Library header — warmer copy [x]
**What:** Change library page header from:
Title: "Library" / Subtitle: "47 assets across 12 categories"
→ Title: "Your library" / Subtitle: "47 assets · {category} filter active" or
"All {n} assets across {n} categories — yours to download."
**Why:** "Library" with a cold count feels like an admin panel.
"Your library" with warmer copy reinforces the membership value.
**Files:**
- `app/(members)/library/page.tsx` — update h1 and subtitle
**Risk:** None. Copy only.

---

## 10. Trust signals on signup page [x]
**What:** Add "30-day money-back guarantee · Secured by Stripe" text
below the signup form, identical to what's on the pricing page.
**Why:** The signup page has zero trust signals. Users about to create an
account are mid-funnel — a guarantee reminder here reduces abandonment.
**Files:**
- `app/(auth)/signup/page.tsx` — add trust strip below form
**Risk:** None. Additive.

---

## EXECUTION ORDER
1 → 8 → 9 → 10 (quick wins, copy/UI only)
2 (highest conversion impact)
3 → 4 (dashboard experience)
5 → 6 → 7 (polish)

Deploy after each group or all at once at end.
