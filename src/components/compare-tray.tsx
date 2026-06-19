"use client";

import { ArrowRight, MousePointerClick, X } from "lucide-react";
import type { Country } from "@/lib/zedas-data";
import Flag from "./flag";

interface CompareTrayProps {
  countries: Country[];
  selectMode: boolean;
  /** Comparison has hit the country cap. */
  full?: boolean;
  onToggleSelectMode: () => void;
  onRemove: (isoN: number) => void;
  onClear: () => void;
  onOpen: () => void;
}

/** Floating hub at the bottom: shows the running selection as removable chips,
 *  lets the user toggle map-selection mode, and opens the full comparison. */
export default function CompareTray({
  countries,
  selectMode,
  full = false,
  onToggleSelectMode,
  onRemove,
  onClear,
  onOpen,
}: CompareTrayProps) {
  const n = countries.length;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[var(--z-drawer)] flex justify-center px-3">
      <div className="zd-rise pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-2xl border border-border bg-surface/95 py-2 pl-3 pr-2 shadow-2xl backdrop-blur-md">
        {selectMode && (
          <span
            className={`flex shrink-0 items-center gap-1.5 pl-1 text-xs font-medium ${
              full ? "text-muted" : "text-accent"
            }`}
          >
            <MousePointerClick className="size-4" aria-hidden />
            <span className="hidden sm:inline">
              {full ? "Maximum 4 — remove one to swap" : "Tap countries to add"}
            </span>
          </span>
        )}

        {n > 0 ? (
          <ul className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
            {countries.map((c) => (
              <li key={c.isoN}>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-2 py-1 pl-2 pr-1 text-sm">
                  <Flag isoN={c.isoN} className="h-3.5 w-auto" />
                  <span className="max-w-[8rem] truncate font-medium text-foreground">
                    {c.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(c.isoN)}
                    aria-label={`Remove ${c.name}`}
                    className="inline-flex size-5 items-center justify-center rounded-full text-muted transition-colors hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="px-1 text-sm text-muted">No countries yet</span>
        )}

        <div className="flex shrink-0 items-center gap-1.5 border-l border-border pl-2">
          <button
            type="button"
            onClick={onToggleSelectMode}
            aria-pressed={selectMode}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              selectMode
                ? "bg-accent text-accent-foreground hover:brightness-95"
                : "border border-border bg-surface text-foreground hover:bg-surface-2"
            }`}
          >
            {selectMode ? "Done" : "Select on map"}
          </button>
          {n > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="hidden rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onOpen}
            disabled={n < 2}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
          >
            Compare
            <span className="tnum">{n}</span>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
