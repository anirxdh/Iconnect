# iConnect — “The Tended Garden”

Luxury single-page brand site for iConnect, the care network for life after 75.

## Run

```bash
cd site
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Anatomy

- `app/` — Next.js 15 App Router; `globals.css` carries the design tokens
  (Tailwind v4 `@theme`): bone/forest/moss/brass palette, Fraunces + Instrument
  Sans, grain overlay, motion keyframes.
- `components/` — one file per section, in page order. Shared motion
  primitives live in `Reveal.tsx`. The hero's cursor "life-bloom" effect is
  `BloomCanvas.tsx`.
- `public/brand/` — the client's campaign imagery (renamed, cropped).
- `public/stock/` — high-res nature photography (Wikimedia Commons,
  CC-licensed featured pictures).
- `DESIGN-SPEC.md` — the binding design system for anyone extending the site.

## Testing

A full Playwright E2E suite lives in `tests/` — 176 tests across four
device projects (desktop Chrome 1440×900, desktop with reduced motion,
iPhone 13 WebKit, 820px tablet):

```bash
npm test           # full suite (builds nothing — run `npm run build && npm start -- -p 4310` first,
                   # or let Playwright start the server itself)
npm run test:ui    # interactive UI mode
npm run test:report
```

- `smoke` — routes, titles, metadata, JSON-LD, favicon, every image fetches
- `nav` — all anchors land, mobile veil (incl. inert-when-closed), logo home
- `hero-journey` — preloader lifecycle, headline word integrity, canvas
  bloom responds to the pointer, pinned horizontal journey traversal
- `programs` — the ten rows, cursor frame follow/swap/hide, scroll-away hide
- `interactions` — accordion, concierge (Escape, tel/mailto), marquee, map
- `legal` — all three policy pages, cross-links, history back/forward
- `a11y` — axe scans (zero critical/serious, incl. color-contrast), heading
  structure, focus visibility, accessible names
- `resilience` — scroll torture up/down, anchor storms, wheel storms,
  rotation mid-scroll, reload mid-page, menu hammering
- `warmup` — proves the background asset warmer: after the page settles,
  a full scroll triggers ZERO image network requests

Every test also fails automatically on any console error or uncaught page
error via the shared fixture in `tests/fixtures.ts`.

## Deploying to Vercel

Set the project **Root Directory** to `site/`. No env vars needed.
