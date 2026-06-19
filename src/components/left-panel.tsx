"use client";

import { Upload } from "lucide-react";
import {
  DATA_NOTE,
  GROUPED_INDICATORS,
  getIndicator,
  indicatorExtent,
  type IndicatorKey,
} from "@/lib/zedas-data";

interface LeftPanelProps {
  active: IndicatorKey;
  onChange: (key: IndicatorKey) => void;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
      {children}
    </h2>
  );
}

const DIRECTION_NOTE: Record<
  "higherBetter" | "higherWorse" | "neutral",
  string
> = {
  higherBetter: "Higher = better",
  higherWorse: "Higher = worse",
  neutral: "Higher = more",
};

export default function LeftPanel({ active, onChange }: LeftPanelProps) {
  const ind = getIndicator(active);

  return (
    <aside
      aria-label="Layers and legend"
      className="pointer-events-auto flex h-full w-full flex-col rounded-xl border border-border bg-surface/90 shadow-sm backdrop-blur-md"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 [overscroll-behavior:contain]">
        {/* 1 — Layers as grouped, exclusive switch rows */}
        <section aria-label="Map layer">
          <Eyebrow>Layers</Eyebrow>
          <div className="mt-1.5 flex flex-col gap-3">
            {GROUPED_INDICATORS.map(({ group, indicators }) => (
              <div key={group} role="group" aria-label={group}>
                <h3 className="px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {group}
                </h3>
                <div className="mt-0.5 flex flex-col">
                  {indicators.map((indicator) => {
                    const isActive = indicator.key === active;
                    return (
                      <button
                        key={indicator.key}
                        type="button"
                        role="switch"
                        aria-checked={isActive}
                        onClick={() => onChange(indicator.key)}
                        className="group flex min-h-11 items-center justify-between gap-3 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-surface-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <span
                          className={`min-w-0 truncate text-sm ${
                            isActive
                              ? "font-semibold text-foreground"
                              : "font-medium text-muted group-hover:text-foreground"
                          }`}
                        >
                          {indicator.label}
                        </span>
                        <span
                          aria-hidden
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            isActive
                              ? "bg-accent"
                              : "bg-surface-2 ring-1 ring-inset ring-border"
                          }`}
                        >
                          <span
                            className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                              isActive ? "translate-x-[18px]" : "translate-x-[2px]"
                            }`}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2 — Hairline divider */}
        <hr className="border-t border-border" />

        {/* 3 — Adaptive legend for the active indicator */}
        <section aria-label={`Legend — ${ind.label}`}>
          <Eyebrow>Legend</Eyebrow>
          {ind.scale === "sequential" ? (
            (() => {
              const [min, max] = indicatorExtent(ind);
              return (
                <div className="mt-2 flex flex-col gap-1.5">
                  <div
                    aria-hidden
                    className="h-3 w-full rounded-full ring-1 ring-inset ring-black/10"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${ind.ramp[0]}, ${ind.ramp[1]})`,
                    }}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="tnum text-[11px] text-foreground/80">
                      {ind.formatValue(min)}
                    </span>
                    <span className="tnum text-[11px] text-foreground/80">
                      {ind.formatValue(max)}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted">
                    {DIRECTION_NOTE[ind.direction]}
                  </span>
                </div>
              );
            })()
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {ind.categories.map((cat) => (
                <li key={cat.key} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs leading-tight text-foreground/90">
                    {cat.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 4 — Global data footnote */}
        <p className="text-[11px] leading-relaxed text-muted">{DATA_NOTE}</p>
      </div>

      {/* Pinned Upload Data button (illustrative only) */}
      <div className="shrink-0 border-t border-border p-3">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Upload className="size-4 text-muted" aria-hidden />
          Upload Data
        </button>
      </div>
    </aside>
  );
}
