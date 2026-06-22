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

/** A small, named section label, set as a chart annotation: a short tick rule
 *  then tracked accent caps. Deliberate wayfinding (it mirrors the nav), and the
 *  tick ties it to the cartographic instrument language used across the page. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-2.5 ${className}`}>
      <span aria-hidden className="h-px w-7 shrink-0 bg-accent/70" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        {children}
      </span>
    </p>
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
