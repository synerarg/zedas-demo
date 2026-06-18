"use client";

import { Upload } from "lucide-react";
import {
  LEGEND_ENDPOINTS,
  PROFILE_COLOR,
  type Profile,
} from "@/lib/zedas-data";
import { LAYERS, getLayer, type LayerId } from "@/lib/layers";

const PROFILE_ORDER: Profile[] = [
  "High Availability – High Quality",
  "High Availability – Quality Constrained",
  "Low Availability – High Efficiency",
  "High Risk – Restricted Use",
];

interface LeftPanelProps {
  active: LayerId;
  onChange: (id: LayerId) => void;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">
      {children}
    </h2>
  );
}

export default function LeftPanel({ active, onChange }: LeftPanelProps) {
  const layer = getLayer(active);

  return (
    <aside
      aria-label="Layers and legend"
      className="pointer-events-auto flex h-full w-full flex-col rounded-xl border border-border bg-surface/90 shadow-sm backdrop-blur-md"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 [overscroll-behavior:contain]">
        {/* 1 — Layers as exclusive switch rows */}
        <section aria-label="Map layer">
          <Eyebrow>Layers</Eyebrow>
          <div role="group" className="mt-1.5 flex flex-col">
            {LAYERS.map((l) => {
              const isActive = l.id === active;
              return (
                <button
                  key={l.id}
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  onClick={() => onChange(l.id)}
                  className="group flex items-center justify-between gap-3 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-surface-2/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="flex min-w-0 flex-col">
                    <span
                      className={`truncate text-sm ${
                        isActive
                          ? "font-semibold text-foreground"
                          : "font-medium text-muted group-hover:text-foreground"
                      }`}
                    >
                      {l.label}
                    </span>
                    {l.placeholder && (
                      <span className="mt-0.5 inline-flex w-fit items-center rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted ring-1 ring-inset ring-border">
                        Placeholder data
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                      isActive ? "bg-accent" : "bg-surface-2 ring-1 ring-inset ring-border"
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
        </section>

        {/* 2 — Hairline divider */}
        <hr className="border-t border-border" />

        {/* 3 — Adaptive legend */}
        <section aria-label={`Legend — ${layer.label}`}>
          <Eyebrow>Legend</Eyebrow>
          {layer.kind === "gradient" && layer.indicatorKey && layer.gradient ? (
            <div className="mt-2 flex flex-col gap-1.5">
              <div
                aria-hidden
                className="h-3 w-full rounded-full ring-1 ring-inset ring-black/10"
                style={{
                  backgroundImage: `linear-gradient(to right, ${layer.gradient[0]}, ${layer.gradient[1]})`,
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <span className="tnum text-[11px] text-foreground/80">
                  {LEGEND_ENDPOINTS[layer.indicatorKey].low}
                </span>
                <span className="tnum text-[11px] text-foreground/80">
                  {LEGEND_ENDPOINTS[layer.indicatorKey].high}
                </span>
              </div>
            </div>
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {PROFILE_ORDER.map((profile) => (
                <li key={profile} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                    style={{ backgroundColor: PROFILE_COLOR[profile] }}
                  />
                  <span className="text-xs leading-tight text-foreground/90">
                    {profile}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
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
