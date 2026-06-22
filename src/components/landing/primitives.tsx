import type { ReactNode } from "react";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** A small, named section label, framed as a survey registration target: four
 *  corner ticks bracketing a crosshair marker and tracked accent caps. It speaks
 *  the page's cartographic-instrument language as a *mark* rather than a plain
 *  rule, so the same badge reads as deliberate wayfinding everywhere it appears. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 ${className}`}
    >
      {/* Corner registration ticks — the four edges of a survey/crop target. */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-1.5 border-l border-t border-accent/60" />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-1.5 border-r border-t border-accent/60" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-1.5 border-b border-l border-accent/60" />
      <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 size-1.5 border-b border-r border-accent/60" />
      {/* Crosshair marker at the sighting point. */}
      <span
        aria-hidden
        className="relative flex size-2.5 shrink-0 items-center justify-center text-accent"
      >
        <span className="absolute h-px w-2.5 bg-current" />
        <span className="absolute h-2.5 w-px bg-current" />
      </span>
      <span className="zd-meas text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        {children}
      </span>
    </span>
  );
}

/** A measured label — tabular figures, wide tracking — for coordinates, indices,
 *  and instrument readouts. Same Geist family (project rule: one typeface). */
export function Measure({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`zd-meas text-[11px] uppercase text-muted ${className}`}>
      {children}
    </span>
  );
}

/** A Phase-2 destination that doesn't exist yet — rendered as a quiet,
 *  non-navigating link with an honest "Coming soon" tag (brief §4). */
export function FuturePageLink({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-disabled="true"
      className={`inline-flex items-center gap-2 text-sm font-medium text-muted ${className}`}
    >
      {children}
      <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
        Soon
      </span>
    </span>
  );
}
