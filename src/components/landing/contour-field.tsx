// Cartographic contour field — the landing's signature device.
// Nested isolines evoke bathymetric depth soundings (water's own visual
// language). Fully deterministic (no random / no Date) so it renders identically
// on server and client. Purely decorative → aria-hidden, currentColor-themed.

type Pt = [number, number];

// Fixed wobble seeds keep each contour cluster organic but reproducible.
const SEED_A = [1.0, 1.12, 0.94, 1.08, 0.9, 1.05, 0.97, 1.14, 0.92, 1.04, 0.99, 1.1];
const SEED_B = [1.06, 0.93, 1.1, 0.96, 1.12, 0.9, 1.04, 0.95, 1.13, 0.91, 1.07, 0.98];

function ring(cx: number, cy: number, r: number, seed: number[], squash = 1): Pt[] {
  const n = seed.length;
  return seed.map((w, i) => {
    const a = (i / n) * Math.PI * 2;
    return [cx + Math.cos(a) * r * w, cy + Math.sin(a) * r * w * squash];
  });
}

/** Closed Catmull-Rom spline → smooth SVG path. */
function spline(points: Pt[]): string {
  const n = points.length;
  const f = (v: number) => v.toFixed(2);
  let d = `M ${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${f(c1x)} ${f(c1y)}, ${f(c2x)} ${f(c2y)}, ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d} Z`;
}

function cluster(cx: number, cy: number, seed: number[], rings: number, base: number, step: number, squash = 1) {
  return Array.from({ length: rings }, (_, i) => spline(ring(cx, cy, base + i * step, seed, squash)));
}

interface ContourFieldProps {
  className?: string;
  /** Subtle infinite drift (disabled automatically under reduced-motion). */
  drift?: boolean;
}

export default function ContourField({ className, drift = false }: ContourFieldProps) {
  const clusterA = cluster(330, 300, SEED_A, 9, 56, 52, 0.86);
  const clusterB = cluster(940, 540, SEED_B, 8, 64, 58, 0.92);

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      data-contour
      className={className}
    >
      <g
        className={drift ? "zd-contour-drift" : undefined}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        style={{ transformOrigin: "center" }}
      >
        {clusterA.map((d, i) => (
          <path key={`a${i}`} d={d} strokeOpacity={0.9 - i * 0.085} />
        ))}
        {clusterB.map((d, i) => (
          <path key={`b${i}`} d={d} strokeOpacity={0.8 - i * 0.08} />
        ))}
      </g>
    </svg>
  );
}
