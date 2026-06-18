# ZEDAS Project — Build Spec (Illustrative Frontend Demo)

This is the build brief for an agent working in a real repo. Scaffold, install, run, and **self-verify** (see §Acceptance). All data is placeholder and lives in `src/lib/zedas-data.ts`. Interface is **English only**.

## 1. Product, in one paragraph
ZEDAS is an interactive world map that classifies every country by its water profile — availability, stress, efficiency — so industries can see where water favors production. The map colors a **16-country pilot**; every other country renders as **No data**. Users switch between three indicator layers and a synthesis layer (the **Zedas Score**), hover for a value, click a country for detail, and add countries to a **comparison drawer**.

## 2. Layout (one screen)
Full-bleed map as the canvas — **the map is the hero, no marketing hero section.** Restrained chrome overlaid:
- **Top-left:** wordmark `ZEDAS Project` (text only) + subtitle `Global water intelligence — pilot release`.
- **Top-right:** country **search** (combobox) + **light/dark** toggle.
- **Left rail** (top segmented control on mobile): the **layer switcher** (§4).
- **Bottom-left:** **legend** for the active layer.
- **On country click:** **modal** (desktop) / bottom sheet (mobile) — §5.
- **Comparison drawer:** slides in from the right when ≥1 country is added — §6.

Mobile-first, scaling up. No horizontal scroll. `min-h-dvh`, safe-area insets, 4/8px spacing scale, defined z-index scale, consistent `max-w` on text panels.

## 3. Map behavior
- Projection `geoEqualEarth`, world centered, fit to viewport. Bounded zoom/pan (zoom 1–4), `touch-action: manipulation`. **Client component, dynamically imported with `ssr: false`.**
- Geographies: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json`.
- **Fill:** join each Geography to data by **ISO numeric code** — `Number(geo.id) === country.isoN` (fallback: match `geo.properties.name`). Pilot country → active-layer color; non-pilot → No-data fill, faint stroke, still hoverable (`No data`). **Verify all 16 render colored.**
- Hover: tooltip with country name + active value (or `No data`); hover/active raise contrast; pointer cursor on pilot countries.
- Click: opens the country modal. Thin borders, subtle background, no shadows on the map.

## 4. Layer switcher
Four mutually exclusive options — **one active**, current selection highlighted (weight + color + indicator):
1. **Zedas Score** — *default on load* (categorical synthesis).
2. **Water Availability** *(placeholder 1)* — gradient.
3. **Water Stress** *(placeholder 2)* — gradient.
4. **Use Efficiency** *(placeholder 3)* — gradient.

Indicator names are provisional — one constant, renameable in one edit. Show a small `Placeholder data` chip on indicator layers.

**Gradients (sequential, single-hue, built with `d3-scale` over the 16 values):**
- Water Availability (higher = better): `#E6F3F4` → `#0F766E`
- Use Efficiency (higher = better): `#E8EEF6` → `#1E40AF`
- Water Stress (higher = worse): `#FBF1DD` → `#B23A48`

## 5. Country modal / bottom sheet
- Header: flag glyph + country name; **Zedas Score** profile as a colored pill.
- The three indicators: label + value + unit, numbers in **tabular figures** via `Intl.NumberFormat`.
- A **horizontal bar chart** (recharts) of the three indicators (each normalized to its layer max), with axis labels, value labels, subtle gridlines (`gray-200`), accessible colors, and an `aria-label` summary.
- **Focal point + affiliation** as a quiet credibility line: `Pilot data steward: {focalPoint} · {affiliation}`.
- **Source** line (placeholder).
- Primary action: **`Add to comparison`** (toggles to `Remove from comparison`).
- Close affordances: visible close button (`aria-label="Close"`), `Esc`, click-outside, swipe-down on mobile. `overscroll-behavior: contain`. Animate from a small scale+fade; trap focus; return focus to trigger on close.

## 6. Comparison drawer
Slides in from the right with ≥1 country. Each entry: Score pill + the three values (tabular). Below, a grouped/horizontal recharts bar comparing one indicator across selected countries. Per-entry remove (`×`) + `Clear all`. **Empty state:** `No countries yet. Open a country and tap "Add to comparison".` Never render an empty chart frame.

## 7. Search
Combobox (shadcn `command`) in the top bar; filters the 16 pilot countries by name; selecting one centers the map and opens its modal. Keyboard-operable (arrows + Enter), proper combobox `aria`, visible label/`aria-label`, `spellCheck={false}`, never blocks paste.

## 8. Visual design system
Institutional, scientific water-data product — but **modern, not stuffy.** Avoid the templated AI defaults (cream + serif + terracotta; near-black + acid accent; broadsheet hairlines). Spend the boldness in **one place — the Zedas Score color system and the map** — and keep everything else quiet.

**Type system (single typeface — NO serif, NO second font family anywhere):**
- One typeface everywhere: **Geist (Geist Sans)** — headings, body/UI, labels, data/numbers, and chart axes all use it.
- Numeric/data text uses `font-variant-numeric: tabular-nums` on Geist (same family — not a separate mono).
- Load Geist once via the `geist` package (`geist/font/sans`). Type scale e.g. 12 / 14 / 16 / 20 / 28; body line-height 1.5; weight encodes hierarchy (600–700 headings, 400 body, 500 labels); `text-wrap: balance` on headings.

**Color tokens (CSS variables / Tailwind theme — no raw hex in components):**
- Neutral water palette: cool off-white surfaces in light; deep slate/ink in dark. One restrained brand accent in the teal family (`#0F766E`).
- **Zedas Score categorical (max hue separation; works light & dark):**
  - High Availability – High Quality → `#0F766E`
  - High Availability – Quality Constrained → `#D4A017`
  - Low Availability – High Efficiency → `#2F6FB0`
  - High Risk – Restricted Use → `#B23A48`
  - No data → `#D8DCE0` (light) / `#2A2F36` (dark)
- All text pairs meet WCAG AA (4.5:1). Never convey meaning by color alone — always pair the Score with its text label (legend, pill, tooltip).

**Both themes:** ship light + dark. `color-scheme` on `<html>`, `<meta name="theme-color">` matching the background; dark uses desaturated tonal variants, not inverted colors; verify Score contrast separately. Labels/dividers encode real meaning (layer, profile, units) — no decorative numbering.

## 9. Motion
Micro-interactions 150–300ms; `ease-out` enter, faster exit. Animate **`transform`/`opacity` only**; never `transition: all`. Modal animates from its trigger; drawer slides; legend items may stagger ~30–50ms on first paint. **Honor `prefers-reduced-motion`** (reduced/disabled variants). Animations interruptible; never block input.

## 10. Quality bar — non-negotiable
A11y & semantics: semantic HTML before ARIA; icon-only buttons get `aria-label`; decorative icons `aria-hidden`; visible `focus-visible` rings (never `outline:none` without replacement); hierarchical headings; full keyboard nav; async updates in `aria-live="polite"`. Touch targets ≥44px, ≥8px apart.
Typography & copy: `…` not `...`; curly quotes; non-breaking spaces in units; active voice; Title Case buttons/headings; specific labels (`Add to comparison`, not `Continue`); numerals for counts; second person.
Content: `truncate`/`line-clamp`/`break-words` on overflow-prone text; `min-w-0` on truncating flex children; never render broken UI for empty arrays.
Perf & robustness: declare image/SVG dimensions (no CLS); skeleton/shimmer for >300ms loads; guard hydration; `Intl.NumberFormat` everywhere.

## 11. Charts rules
Comparison → bar; legend always visible near the chart; tooltip on hover/tap with exact values; axis labels with units; tabular formatting; gridlines low-contrast (`gray-200`); data-vs-background ≥3:1; `aria-label`/text summary per chart; responsive (horizontal bars on small screens); meaningful empty state; reduced-motion respected.

## 12. Out of scope (do NOT build)
No backend / API / database / Sheets connection. No auth. No logo (wordmark only). No real indicator definitions or values — placeholders only. No Etapa-2 features (value-chain relocation, multi-user, sub-national granularity, 198-country scale).

## Acceptance check (self-verify with the dev server + Playwright before finishing)
1. All **16 pilot countries render colored**; every other country is `No data`.
2. All **four Zedas Score colors visible** on the default layer.
3. Layer switch works; active highlighted; legend updates.
4. Hover tooltip shows the active value; click opens the modal with the bar chart + focal point line.
5. Add/remove comparison works; drawer shows side-by-side bars; empty state shows when cleared.
6. Search finds & focuses a country.
7. Light **and** dark both correct; `prefers-reduced-motion` respected; responsive to mobile, no horizontal scroll; keyboard + focus states work.
8. `npx tsc --noEmit` and `npm run lint` pass.

Mock data lives in `src/lib/zedas-data.ts` (drop-in). Indicator labels/values are placeholders — replace when CAA confirms the three indicators and the Zedas Score thresholds.
