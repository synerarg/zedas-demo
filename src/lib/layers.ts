// src/lib/layers.ts
// Layer configuration + value/format/color helpers for the ZEDAS map.
// All indicator names are PLACEHOLDER and renameable in one edit here
// (they read straight from INDICATORS in zedas-data.ts).

import { scaleLinear } from "d3-scale";
import { geoEqualEarth } from "d3-geo";
import {
  COUNTRIES,
  GRADIENT,
  INDICATORS,
  PROFILE_COLOR,
  type Country,
  type Profile,
} from "./zedas-data";

export type LayerId = "score" | "availability" | "stress" | "efficiency";

/** Numeric indicator keys on a Country (the three placeholder indicators). */
export type IndicatorKey = "availability" | "stress" | "efficiency";

export interface LayerDef {
  id: LayerId;
  label: string;
  kind: "categorical" | "gradient";
  placeholder: boolean;
  /** gradient layers only */
  indicatorKey?: IndicatorKey;
  unit?: string;
  direction?: "higherBetter" | "higherWorse";
  gradient?: readonly [string, string];
}

/** The four mutually exclusive layers. Zedas Score is the default. */
export const LAYERS: readonly LayerDef[] = [
  { id: "score", label: "Zedas Score", kind: "categorical", placeholder: false },
  {
    id: "availability",
    label: INDICATORS.availability.label,
    kind: "gradient",
    placeholder: INDICATORS.availability.placeholder,
    indicatorKey: "availability",
    unit: INDICATORS.availability.unit,
    direction: INDICATORS.availability.direction,
    gradient: GRADIENT.availability,
  },
  {
    id: "stress",
    label: INDICATORS.stress.label,
    kind: "gradient",
    placeholder: INDICATORS.stress.placeholder,
    indicatorKey: "stress",
    unit: INDICATORS.stress.unit,
    direction: INDICATORS.stress.direction,
    gradient: GRADIENT.stress,
  },
  {
    id: "efficiency",
    label: INDICATORS.efficiency.label,
    kind: "gradient",
    placeholder: INDICATORS.efficiency.placeholder,
    indicatorKey: "efficiency",
    unit: INDICATORS.efficiency.unit,
    direction: INDICATORS.efficiency.direction,
    gradient: GRADIENT.efficiency,
  },
] as const;

export const INDICATOR_LAYERS = LAYERS.filter(
  (l): l is LayerDef & { indicatorKey: IndicatorKey } => l.kind === "gradient",
);

export function getLayer(id: LayerId): LayerDef {
  return LAYERS.find((l) => l.id === id) ?? LAYERS[0];
}

/** min / max of each indicator across the 16 pilot countries. */
export const INDICATOR_EXTENT: Record<IndicatorKey, [number, number]> = {
  availability: extent("availability"),
  stress: extent("stress"),
  efficiency: extent("efficiency"),
};

function extent(key: IndicatorKey): [number, number] {
  const vals = COUNTRIES.map((c) => c[key]);
  return [Math.min(...vals), Math.max(...vals)];
}

/** Number of pilot countries (denominator for "Rank #k of N"). */
export const PILOT_COUNT = COUNTRIES.length;

/** One distinct, AA-contrast color per indicator (matches the modal/comparison
 *  charts) — used for the hover-tooltip mini bars. */
export const INDICATOR_COLOR: Record<IndicatorKey, string> = {
  availability: "#0F766E",
  stress: "#B23A48",
  efficiency: "#1E40AF",
};

/** Per-indicator rank, precomputed once. Ranked by descending value
 *  (1 = highest = best, since indicators are treated as higher-is-better). */
const INDICATOR_RANK: Record<IndicatorKey, Record<number, number>> = (() => {
  const out = {
    availability: {},
    stress: {},
    efficiency: {},
  } as Record<IndicatorKey, Record<number, number>>;
  for (const key of ["availability", "stress", "efficiency"] as IndicatorKey[]) {
    [...COUNTRIES]
      .sort((a, b) => b[key] - a[key])
      .forEach((c, i) => {
        out[key][c.isoN] = i + 1;
      });
  }
  return out;
})();

export function indicatorRank(key: IndicatorKey, isoN: number): number {
  return INDICATOR_RANK[key][isoN];
}

// ── Color ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const c = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Sequential single-hue color for a gradient layer value. */
export function gradientColor(layer: LayerDef, value: number): string {
  if (!layer.gradient || !layer.indicatorKey) return "#999999";
  const [min, max] = INDICATOR_EXTENT[layer.indicatorKey];
  // d3-scale maps the value into a clamped 0–1 position…
  const t = scaleLinear().domain([min, max]).range([0, 1]).clamp(true)(value);
  // …then we interpolate the two single-hue endpoints in RGB.
  const a = hexToRgb(layer.gradient[0]);
  const b = hexToRgb(layer.gradient[1]);
  return rgbToHex([
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]);
}

/** Fill for a country on the map under the active layer (pilot countries only). */
export function countryFill(layer: LayerDef, country: Country): string {
  if (layer.kind === "categorical") return PROFILE_COLOR[country.profile];
  return gradientColor(layer, country[layer.indicatorKey!]);
}

/** Pills/labels: does this score color want light or dark text on top? */
export function profileTextColor(profile: Profile): string {
  // Gold (#D4A017) needs dark text; the other three carry white at AA.
  return profile === "High Availability – Quality Constrained" ? "#1A1206" : "#ffffff";
}

// ── Formatting (English, tabular, non-breaking unit) ─────────────────────────

const NBSP = " ";
const intNF = new Intl.NumberFormat("en-US");
const decNF = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? intNF.format(value) : decNF.format(value);
}

/** "19,000 m³/cap/yr" with a non-breaking space before the unit. */
export function formatIndicator(key: IndicatorKey, value: number): string {
  return `${formatNumber(value)}${NBSP}${INDICATORS[key].unit}`;
}

/** The active value of a country under a layer, as display text. */
export function layerValueText(layer: LayerDef, country: Country): string {
  if (layer.kind === "categorical") return country.profile;
  return formatIndicator(layer.indicatorKey!, country[layer.indicatorKey!]);
}

/** Value normalized to its indicator's max (0–1) — for chart bar lengths. */
export function normalizedToMax(key: IndicatorKey, value: number): number {
  const max = INDICATOR_EXTENT[key][1];
  return max === 0 ? 0 : value / max;
}

/** Theme-resolved fills for non-pilot geographies + strokes. Mirrors the
 *  --no-data / --map-stroke tokens in globals.css (kept here for synchronous,
 *  SSR-safe access when computing SVG fill attributes). */
export const MAP_COLORS = {
  light: { noData: "#d8dce0", stroke: "#c4cdd5", strokeStrong: "#8a99a6" },
  dark: { noData: "#2a2f36", stroke: "#313c46", strokeStrong: "#5a6976" },
} as const;

/** Flag glyph (emoji) per pilot country, keyed by ISO numeric. Decorative. */
export const FLAGS: Record<number, string> = {
  32: "🇦🇷",
  76: "🇧🇷",
  170: "🇨🇴",
  484: "🇲🇽",
  404: "🇰🇪",
  231: "🇪🇹",
  288: "🇬🇭",
  710: "🇿🇦",
  834: "🇹🇿",
  800: "🇺🇬",
  854: "🇧🇫",
  466: "🇲🇱",
  566: "🇳🇬",
  356: "🇮🇳",
  524: "🇳🇵",
  704: "🇻🇳",
};

// ── Map navigation bounds ────────────────────────────────────────────────────
// Fixed projection coordinate space; the SVG scales to its container via CSS, so
// translateExtent is expressed in this space and clamps panning to the map
// bounds (d3-zoom's default extent is infinite → the world can drift off-screen).
export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 420;
export const MAP_SCALE = 168;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;
export const TRANSLATE_EXTENT: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_WIDTH, MAP_HEIGHT],
];

// The same projection react-simple-maps builds internally (geoEqualEarth,
// centered in the coordinate space) — used to clamp recenter targets.
const projection = geoEqualEarth()
  .scale(MAP_SCALE)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

/** Clamp a recenter target [lng, lat] so the controlled center+zoom keeps the
 *  whole map inside the viewport. react-simple-maps only constrains interactive
 *  gestures (via translateExtent), not controlled center/zoom props, so an
 *  edge country could otherwise be centered past the map's edge. */
export function clampCenter(
  center: [number, number],
  zoom: number,
): [number, number] {
  const projected = projection(center);
  if (!projected || zoom <= 1) return [0, 0];
  const [px, py] = projected;
  // Valid projected-center range so the scaled map still covers the viewport.
  const cx = clamp(px, MAP_WIDTH / (2 * zoom), MAP_WIDTH * (1 - 1 / (2 * zoom)));
  const cy = clamp(py, MAP_HEIGHT / (2 * zoom), MAP_HEIGHT * (1 - 1 / (2 * zoom)));
  const inverted = projection.invert?.([cx, cy]);
  return (inverted as [number, number] | undefined) ?? center;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi);
}

// ── Map centering ────────────────────────────────────────────────────────────
// Approximate [lng, lat] for each pilot country, used to recenter the map when a
// country is chosen from search. Demo-grade centroids — not survey data.
export const CENTROIDS: Record<number, [number, number]> = {
  32: [-64, -38], // Argentina
  76: [-53, -10], // Brazil
  170: [-73, 4], // Colombia
  484: [-102, 23], // Mexico
  404: [38, 0.5], // Kenya
  231: [40, 8], // Ethiopia
  288: [-1, 8], // Ghana
  710: [25, -29], // South Africa
  834: [35, -6], // Tanzania
  800: [32, 1], // Uganda
  854: [-2, 12], // Burkina Faso
  466: [-4, 17], // Mali
  566: [8, 9], // Nigeria
  356: [79, 22], // India
  524: [84, 28], // Nepal
  704: [106, 16], // Vietnam
};
