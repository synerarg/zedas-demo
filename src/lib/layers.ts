// src/lib/layers.ts
// Map presentation + geometry helpers (theme fills, flags, centroids, zoom
// bounds). All indicator data, colours, and formatting live in zedas-data.ts.

import { geoEqualEarth } from "d3-geo";

/** Fills for non-pilot geographies + strokes. Mirrors the --no-data /
 *  --map-stroke light tokens in globals.css (kept here for synchronous,
 *  SSR-safe access when computing SVG fill attributes). */
export const MAP_COLORS = {
  noData: "#d8dce0",
  stroke: "#c4cdd5",
  strokeStrong: "#8a99a6",
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
