"use client";

import { useId, useState } from "react";
import { ChevronDown, Info, Upload } from "lucide-react";
import {
  DATA_NOTE,
  GROUPED_INDICATORS,
  getIndicator,
  indicatorExtent,
  type IndicatorGroup,
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

const EXPO = "[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]";

/** Which group block contains the active indicator. */
function groupOf(key: IndicatorKey): IndicatorGroup {
  return (
    GROUPED_INDICATORS.find((b) => b.indicators.some((i) => i.key === key))
      ?.group ?? GROUPED_INDICATORS[0].group
  );
}

export default function LeftPanel({ active, onChange }: LeftPanelProps) {
  const ind = getIndicator(active);
  const baseId = useId();
  // Single-open accordion: the group holding the active layer starts expanded.
  const [openGroup, setOpenGroup] = useState<IndicatorGroup | null>(() =>
    groupOf(active),
  );
  const [showNotes, setShowNotes] = useState(false);

  return (
    <aside
      aria-label="Layers and legend"
      className="pointer-events-auto flex h-full w-full flex-col rounded-xl border border-border bg-surface/95 shadow-sm"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 [overscroll-behavior:contain]">
        {/* 1 — Layers as a single-open accordion of single-select groups */}
        <section aria-label="Map layer">
          <Eyebrow>Layers</Eyebrow>
          <div className="mt-1.5 flex flex-col divide-y divide-border">
            {GROUPED_INDICATORS.map(({ group, indicators }) => {
              const isOpen = openGroup === group;
              const activeInGroup = indicators.find((i) => i.key === active);
              const panelId = `${baseId}-${group.replace(/\W+/g, "")}`;
              return (
                <div key={group} className="py-1 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenGroup(isOpen ? null : group)}
                    className="flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-surface-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">
                        {group}
                      </span>
                      {/* When collapsed, surface the active layer so the user
                          knows what's on without expanding. */}
                      {!isOpen && activeInGroup && (
                        <span className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] font-medium text-foreground">
                          <span
                            aria-hidden
                            className="size-1.5 shrink-0 rounded-full bg-accent"
                          />
                          {activeInGroup.label}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={`size-4 shrink-0 text-muted transition-transform duration-300 ${EXPO} ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={panelId}
                    inert={!isOpen}
                    className={`grid transition-all duration-300 ${EXPO} ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        role="radiogroup"
                        aria-label={group}
                        className="flex flex-col pb-1 pt-0.5"
                      >
                        {indicators.map((indicator) => {
                          const isActive = indicator.key === active;
                          return (
                            <button
                              key={indicator.key}
                              type="button"
                              role="radio"
                              aria-checked={isActive}
                              onClick={() => onChange(indicator.key)}
                              className="group flex min-h-10 items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-surface-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                              <span
                                aria-hidden
                                className={`grid size-4 shrink-0 place-items-center rounded-full border transition-colors ${
                                  isActive
                                    ? "border-accent"
                                    : "border-border group-hover:border-muted"
                                }`}
                              >
                                {isActive && (
                                  <span className="size-2 rounded-full bg-accent" />
                                )}
                              </span>
                              <span
                                className={`min-w-0 truncate text-sm ${
                                  isActive
                                    ? "font-semibold text-foreground"
                                    : "font-medium text-muted group-hover:text-foreground"
                                }`}
                              >
                                {indicator.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

        {/* 4 — Data note, demoted behind a disclosure to reduce clutter */}
        <div>
          <button
            type="button"
            aria-expanded={showNotes}
            onClick={() => setShowNotes((v) => !v)}
            className="flex items-center gap-1.5 rounded text-[11px] font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Info aria-hidden className="size-3.5" />
            Data &amp; sources
            <ChevronDown
              aria-hidden
              className={`size-3 transition-transform duration-300 ${EXPO} ${
                showNotes ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-300 ${EXPO} ${
              showNotes ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <p className="pt-1.5 text-[11px] leading-relaxed text-muted">
                {DATA_NOTE}
              </p>
            </div>
          </div>
        </div>
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
