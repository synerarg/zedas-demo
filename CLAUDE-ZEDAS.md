# ZEDAS Project — Frontend Demo

## What this is
An **illustrative, frontend-only demo** of a global water-intelligence map for the Cámara Argentina del Agua (CAA). Pitch/kick-off artifact. **No backend, no auth, no database, no real data** — everything reads from `src/lib/zedas-data.ts`. Built so it can later become the real Etapa-1 product (swap mock data → Google Sheets, plug real indicators) without throwing anything away.

Full build brief: see `SPEC.md`. Setup steps: see `setup.sh`.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS.
- Map: `react-simple-maps` (projection `geoEqualEarth`) + `d3-scale` for gradients.
- Charts: `recharts`. Icons: `lucide-react` only. Modal/search: shadcn `dialog` + `command`.
- Fonts via `next/font` + the `geist` package.

## Terminology (use these exact terms)
- Wordmark: **`ZEDAS Project`** — text only, never a logo.
- Layers (one active at a time): **Zedas Score** (default), **Water Availability**, **Water Stress**, **Use Efficiency**. The three indicators are **placeholders**.
- Zedas Score profiles: `High Availability – High Quality`, `High Availability – Quality Constrained`, `Low Availability – High Efficiency`, `High Risk – Restricted Use`.
- Countries with no values render as **`No data`**.

## Non-negotiable rules
- **YOU MUST** keep the entire interface **English only**.
- **YOU MUST** use a **single typeface across the entire project — Geist (Geist Sans), used everywhere** (headings, body, labels, charts, axes, numbers). **NEVER a serif typeface, and NEVER a second font family anywhere.** Use `font-variant-numeric: tabular-nums` on Geist for numeric/data text (same family — not a separate mono). Load it once via the `geist` package (`geist/font/sans`) and keep the family token in one tokens file so it can be swapped in one edit.
- **YOU MUST** color all **16 pilot countries** and render every other country as `No data`. Verify all 16 actually render before declaring done.
- **YOU MUST** meet the quality bar (accessibility, `focus-visible`, `tabular-nums`, typographic `…` and curly quotes, `prefers-reduced-motion`, semantic HTML). Defer to the installed skills below for the detailed rules.
- **IMPORTANT:** `react-simple-maps` must be a **client component, dynamically imported with `ssr: false`** (avoids hydration mismatch in App Router).
- All data is **placeholder**; keep it centralized in `src/lib/zedas-data.ts`.
- **NEVER** add a logo, backend, auth, real data, or any Etapa-2 feature.

## Skills to load (install before building)
- `frontend-design` (Anthropic) — aesthetic direction, avoid templated defaults, the signature element (here: the map + the Zedas Score color system).
- `ui-ux-pro-max` — broad UX/a11y/charts rulebook.
- `web-design-guidelines` (Vercel) — concrete UI-code compliance checklist.
Install them under `.claude/skills/` (or via your `synera-skills` marketplace). They load on demand.

## Build & verify commands
- Dev: `npm run dev`  ·  Typecheck: `npx tsc --noEmit`  ·  Lint: `npm run lint`  ·  Build: `npm run build`
- **Before done:** run the dev server, drive it with Playwright, screenshot, and confirm every item in the `## Acceptance check` section of `SPEC.md` (16 colored, 4 Score colors visible, layer switch, modal + chart, comparison, search, light/dark, reduced-motion, responsive, no horizontal scroll). Fix and repeat.

## Gotchas
- Peer-dep friction with React 19 / Next 15 ↔ `react-simple-maps`: if install fails, retry with `--legacy-peer-deps`, or pin Next 14 / React 18.
- Map must be `ssr: false` (see rules).
