"use client";

import { useEffect } from "react";
import { Check, Plus, X } from "lucide-react";
import {
  GROUPED_INDICATORS,
  WITHDRAWAL_SECTORS,
  DATA_NOTE,
  formatNumber,
  sourceLines,
  indicatorCategory,
  type Country,
  type Indicator,
} from "@/lib/zedas-data";
import Flag from "./flag";

interface CountryDetailProps {
  country: Country | null;
  open: boolean;
  onClose: () => void;
  inComparison: boolean;
  /** Comparison is at the country cap — block adding new ones. */
  comparisonFull?: boolean;
  onToggleComparison: (isoN: number) => void;
}

function WithdrawalSplit({ country }: { country: Country }) {
  return (
    <div className="mt-2.5">
      <div
        className="flex h-2.5 w-full overflow-hidden rounded-full bg-surface-2"
        role="presentation"
      >
        {WITHDRAWAL_SECTORS.map((sector) => (
          <div
            key={sector.key}
            style={{
              width: `${sector.value(country)}%`,
              backgroundColor: sector.color,
            }}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {WITHDRAWAL_SECTORS.map((sector) => (
          <li
            key={sector.key}
            className="flex items-center gap-1.5 text-[11px] text-muted"
          >
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: sector.color }}
            />
            <span className="text-foreground">{sector.label}</span>
            <span className="tnum">{formatNumber(sector.value(country), 1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IndicatorRow({ ind, country }: { ind: Indicator; country: Country }) {
  const wide = ind.key === "totalWithdrawal";
  return (
    <div
      className={`rounded-lg border border-border bg-surface-2/50 p-3 ${
        wide ? "col-span-2" : ""
      }`}
    >
      <div className="text-[11px] leading-tight text-muted">{ind.label}</div>
      {ind.scale === "sequential" ? (
        <>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="tnum text-lg font-semibold text-foreground">
              {ind.format(country)}
            </span>
            {ind.rank !== null && (
              <span className="tnum text-[11px] text-muted">
                World rank #{ind.rank(country)}
              </span>
            )}
          </div>
          {wide && <WithdrawalSplit country={country} />}
        </>
      ) : (
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2 py-0.5 text-xs text-foreground">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: indicatorCategory(ind, country).color }}
            />
            {indicatorCategory(ind, country).label}
          </span>
          {ind.unit === "%" && (
            <span className="tnum text-[11px] text-muted">
              {ind.format(country)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function CountryDetail({
  country,
  open,
  onClose,
  inComparison,
  comparisonFull = false,
  onToggleComparison,
}: CountryDetailProps) {
  // Esc closes the panel (the map stays interactive otherwise — no overlay).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !country) return null;

  return (
    <aside
      role="region"
      aria-label={`${country.name} — water profile`}
      data-zd-drawer
      data-state="open"
      className="pointer-events-auto fixed inset-y-0 right-0 z-[var(--z-drawer)] flex h-dvh w-full flex-col border-l border-border bg-surface shadow-2xl pb-[env(safe-area-inset-bottom)] sm:w-[min(24rem,92vw)]"
    >
      {/* Header */}
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <Flag isoN={country.isoN} className="h-7 w-auto" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">
              {country.name}
            </h2>
            <p className="truncate text-xs text-muted">{country.region}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close country detail"
          className="-mr-1.5 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X className="size-5" aria-hidden />
        </button>
      </header>

      {/* Scrollable body — content refreshes (keyed) when the country changes. */}
      <div
        key={country.isoN}
        className="zd-rise min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4 [overscroll-behavior:contain]"
      >
        {GROUPED_INDICATORS.map(({ group, indicators }) => (
          <section key={group}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {group}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {indicators.map((ind) => (
                <IndicatorRow key={ind.key} ind={ind} country={country} />
              ))}
            </div>
          </section>
        ))}

        <div className="space-y-2 border-t border-border pt-3 text-[11px] leading-relaxed text-muted">
          <p className="font-medium text-foreground/80">Sources</p>
          <ul className="space-y-0.5">
            {sourceLines().map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>{DATA_NOTE}</p>
        </div>
      </div>

      {/* Pinned action */}
      <div className="shrink-0 border-t border-border px-5 py-3">
        <button
          type="button"
          onClick={() => onToggleComparison(country.isoN)}
          disabled={comparisonFull && !inComparison}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 ${
            inComparison
              ? "border border-border bg-surface text-foreground hover:bg-surface-2"
              : "bg-accent text-accent-foreground hover:brightness-95"
          }`}
        >
          {inComparison ? (
            <>
              <Check className="size-4" aria-hidden />
              In comparison
            </>
          ) : comparisonFull ? (
            "Comparison full (max 4)"
          ) : (
            <>
              <Plus className="size-4" aria-hidden />
              Add to comparison
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
