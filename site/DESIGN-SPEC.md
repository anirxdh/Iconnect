# iConnect — “The Tended Garden” · Design Specification

A single-page brand site for **iConnect**: a tech-powered care network for people
aged 75+. It unifies health records, a 24/7 wearable, trained caretakers, and
emergency services into one circle of care. Tone: **quiet luxury, botanical
apothecary, editorial**. Think Aesop, Kinfolk, the moss-branch site — never
corporate SaaS. The reader should feel *tended to*.

## Non-negotiable rules

1. **Stack**: Next.js 15 App Router + Tailwind v4 (tokens below) + `motion/react`
   (import from `"motion/react"`) . TypeScript strict. Every animated component
   starts with `"use client"`.
2. **Use ONLY the design tokens** (Tailwind classes derived from `@theme` in
   `app/globals.css`): colors `bone mist parchment forest pine moss fern sage
   brass clay ink`; fonts via helper classes `voice-display` (italic Fraunces,
   for display lines), `voice-upright` (upright Fraunces), `voice-kicker`
   (spaced uppercase label). Body text = default sans (Instrument Sans).
3. **Motion vocabulary** (import from `@/components/Reveal`):
   `Reveal` (fade-rise), `WordsReveal` (clipped word slots), `InkReveal`
   (word-by-word ink breathing for paragraphs), `RuleReveal` (self-drawing rule),
   `CurtainImage` (curtain unveil + settle scale), `EASE` (the shared cubic-bezier).
   Custom scroll choreography uses `useScroll` + `useTransform` from motion.
   All entrances once-only (`viewport={{ once: true }}` is the default in helpers).
4. **Rhythm**: sections breathe — vertical padding `py-28 md:py-40`+. Gutters
   `px-6 md:px-12`. Max content width `max-w-[90rem] mx-auto` unless full-bleed.
5. **Every section opens with**: a `voice-kicker` label (e.g. `01 — The Vision`)
   + a `RuleReveal`, then a display headline via `WordsReveal`.
6. **Accessibility**: semantic headings in order, `alt` text on meaningful
   images, `aria-hidden` on decorative ones, keyboard-reachable interactions,
   honors `prefers-reduced-motion` (the helpers already do).
7. **Images**: use plain `<img>` (loading="lazy") or `CurtainImage`. NEVER
   hotlink external URLs. Available files:

### /public/brand/ (campaign imagery, portrait ~550×700)
- `balance-stones.jpg` — stone cairn in mossy forest, “BALANCE.” overlay
- `rest-forest.jpg` — sunlit green forest, script “Rest” overlay
- `stillness-buddha.jpg` — stone buddha among blurred leaves
- `tree-canopy.jpg` — looking up a mossy trunk into green canopy
- `breathe-leaves.jpg` — dark palm leaves, “BREATHE” letterspaced overlay
- `health-avocados.jpg` — avocado crates, “take care of your health.”
- `blueberries.jpg` — bowl of blueberries on silk, “eat how I want to feel”
- `apothecary.jpg` — sunlit shelf of oils, brass vessels, towels, rose
- `washing-herbs.jpg` — hands washing fresh herbs, water splash
- `herbal-brew.jpg` — rosemary + star anise + cinnamon steeping in a pot
- `papaya-table.jpg` — papayas & butterflies on dark wood, chiaroscuro
- `elder-braid.jpg` — B&W: aged hands braiding long silver hair
- `hands-held.jpg` — B&W: two elderly hands clasped, wedding rings
- `elder-rest.jpg` — B&W: elderly woman seated, hands folded on lap

### /public/stock/ (high-res 3840px landscape)
- `ancient-tree.jpg` — HERO ONLY (already used)
- `fog-trees.jpg` — three laurel trees on mossy meadow in thick fog
- `moss-ravine.jpg` — moss carpet macro with young bilberry seedling
- `beech-ferns.jpg` — dense fern & beech understory, deep green

### B&W treatment
The three elder B&W photos may use class `photo-bloom` (grayscale that warms
to color on hover — they are already B&W source, so pair with a subtle
`sepia`/duotone overlay div if colorization is desired, or simply use as-is).

## Voice / copywriting rules
Short declarative sentences. Warm, dignified, never patronizing. Botanical
metaphors (tend, root, bloom, season, harvest). No exclamation marks, no
“revolutionary/cutting-edge” SaaS-speak. Numbers written plainly: “Ten to
fifteen patients. Never more.”

## Section map (page order)
1. Preloader, Nav, Hero, Marquee — DONE (see components for style reference)
2. `Manifesto.tsx` — id="vision", kicker `01 — The Vision`
3. `Journey.tsx` — id="circle", kicker `02 — The Circle`, pinned horizontal scroll
4. `Caretakers.tsx` — kicker `03 — The Caretakers`, dark section
5. `Programs.tsx` — id="programs", kicker `04 — The Programs`, cursor image reveal
6. `Nourishment.tsx` — id="nourishment", kicker `05 — Nourishment`
7. `Safety.tsx` — kicker `06 — The Watch`, dark section
8. `Toolkit.tsx` — id="caregivers", kicker `07 — For Caregivers`
9. `AccessTiers.tsx` — id="begin", kicker `08 — Ways In`
10. `Closing.tsx` — footer + closing CTA

Light sections sit on `bg-bone`; dark on `bg-forest` (or `bg-pine`). Alternate
so the page inhales (light) and exhales (dark): 2 light, 3 light, 4 dark,
5 light, 6 light(parchment ok), 7 dark, 8 light, 9 light, 10 dark.
