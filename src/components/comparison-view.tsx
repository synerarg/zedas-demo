"use client";

import { useEffect } from "react";
import { Download, Plus, Trophy, X } from "lucide-react";
import {
  GROUPED_INDICATORS,
  indicatorCategory,
  indicatorFraction,
  sourceLines,
  type Country,
  type Indicator,
  type IndicatorKey,
} from "@/lib/zedas-data";
import Flag from "./flag";

interface ComparisonViewProps {
  open: boolean;
  onClose: () => void;
  countries: Country[];
  activeKey: IndicatorKey;
  onRemove: (isoN: number) => void;
  onClear: () => void;
  /** Enter map-selection mode to add more countries. */
  onAddMore: () => void;
}

/** ISO of the "best" country for an indicator, by its direction. Neutral and
 *  categorical indicators have no winner. */
function bestIsoN(ind: Indicator, countries: Country[]): number | null {
  if (ind.scale !== "sequential" || ind.direction === "neutral") return null;
  let best: number | null = null;
  let bestVal = Number.NaN;
  for (const c of countries) {
    const v = ind.numericValue(c);
    if (
      Number.isNaN(bestVal) ||
      (ind.direction === "higherBetter" ? v > bestVal : v < bestVal)
    ) {
      bestVal = v;
      best = c.isoN;
    }
  }
  return best;
}

/** Build and download a real .xlsx of the comparison (numeric values so it can
 *  be sorted/charted in Excel; categoricals export their label). */
async function exportXlsx(countries: Country[]) {
  const XLSX = await import("xlsx");
  const header = ["Indicator", "Unit", ...countries.map((c) => c.name)];
  const aoa: (string | number)[][] = [header];
  for (const { group, indicators } of GROUPED_INDICATORS) {
    aoa.push([group]);
    for (const ind of indicators) {
      const values = countries.map((c) =>
        ind.scale === "sequential"
          ? ind.numericValue(c)
          : indicatorCategory(ind, c).label,
      );
      aoa.push([ind.label, ind.unit ?? "", ...values]);
    }
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [
    { wch: 28 },
    { wch: 12 },
    ...countries.map(() => ({ wch: 16 })),
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comparison");
  XLSX.writeFile(wb, "zedas-comparison.xlsx");
}

function Cell({
  ind,
  country,
  countries,
  isBest,
}: {
  ind: Indicator;
  country: Country;
  countries: Country[];
  isBest: boolean;
}) {
  const base = "border-b border-border px-6 py-5 align-middle";
  if (ind.scale === "sequential") {
    const max = Math.max(...countries.map((c) => ind.numericValue(c)));
    const frac = indicatorFraction(ind, country, [0, max]);
    return (
      <td className={`${base} ${isBest ? "bg-accent/[0.08]" : ""}`}>
        <div className="flex items-baseline justify-between gap-3">
          <span
            className={`tnum text-lg font-semibold ${
              isBest ? "text-accent" : "text-foreground"
            }`}
          >
            {ind.format(country)}
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            {isBest && (
              <Trophy className="size-3.5 text-accent" aria-label="Best" />
            )}
            {ind.rank && (
              <span className="tnum text-xs text-muted">#{ind.rank(country)}</span>
            )}
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.round(frac * 100)}%`,
              backgroundColor: isBest ? "var(--accent)" : ind.ramp[1],
            }}
          />
        </div>
      </td>
    );
  }
  const cat = indicatorCategory(ind, country);
  return (
    <td className={base}>
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: cat.color }}
        />
        <span className="text-[15px] font-medium text-foreground">
          {cat.label}
        </span>
        {ind.unit === "%" && (
          <span className="tnum text-xs text-muted">{ind.format(country)}</span>
        )}
      </span>
    </td>
  );
}

export default function ComparisonView({
  open,
  onClose,
  countries,
  activeKey,
  onRemove,
  onClear,
  onAddMore,
}: ComparisonViewProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const enough = countries.length >= 2;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare countries"
      data-zd-compare
      data-state="open"
      className="fixed inset-0 z-[100] flex flex-col bg-background"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Compare countries
          </h2>
          <p className="tnum text-xs text-muted">{countries.length} selected</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => exportXlsx(countries)}
            disabled={!enough}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="size-4" aria-hidden />
            <span className="hidden sm:inline">Export to Excel (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={onAddMore}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus className="size-4" aria-hidden />
            <span className="hidden sm:inline">Add countries</span>
          </button>
          {countries.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </header>

      {!enough ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-balance text-[15px] leading-relaxed text-muted">
            Pick at least two countries to compare them side by side.
          </p>
          <button
            type="button"
            onClick={onAddMore}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus className="size-4" aria-hidden />
            Select countries on the map
          </button>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto [overscroll-behavior:contain]">
          {/* w-full + auto layout: few countries stretch their columns to fill
              the width (air); many hit the min-width floor and scroll. */}
          <table className="w-full border-separate border-spacing-0">
            <caption className="sr-only">
              Water indicators across the selected countries. Each row is one
              indicator; the highlighted cell is the strongest performer.
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-30 w-[15rem] border-b border-r border-border bg-surface px-5 py-4 text-left sm:px-8"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Indicator
                  </span>
                </th>
                {countries.map((c) => (
                  <th
                    key={c.isoN}
                    scope="col"
                    className="sticky top-0 z-20 min-w-[13rem] border-b border-border bg-surface px-6 py-4 text-left align-top"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-2">
                        <Flag isoN={c.isoN} className="h-5 w-auto" />
                        <span className="truncate text-base font-semibold text-foreground">
                          {c.name}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(c.isoN)}
                        aria-label={`Remove ${c.name}`}
                        className="-mr-1 -mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <X className="size-4" aria-hidden />
                      </button>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">{c.region}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPED_INDICATORS.map(({ group, indicators }) => (
                <GroupRows
                  key={group}
                  group={group}
                  indicators={indicators}
                  countries={countries}
                  activeKey={activeKey}
                  colSpan={countries.length + 1}
                />
              ))}
            </tbody>
          </table>

          <div className="px-5 py-5 text-xs leading-relaxed text-muted sm:px-8">
            <p>
              Bars are scaled to the highest value in each row. The{" "}
              <Trophy
                className="inline size-3.5 align-[-2px] text-accent"
                aria-hidden
              />{" "}
              marks the strongest performer where an indicator has a clear better
              direction.
            </p>
            {sourceLines().map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupRows({
  group,
  indicators,
  countries,
  activeKey,
  colSpan,
}: {
  group: string;
  indicators: Indicator[];
  countries: Country[];
  activeKey: IndicatorKey;
  colSpan: number;
}) {
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={colSpan}
          className="sticky left-0 z-10 border-b border-border bg-surface-2 px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted sm:px-8"
        >
          {group}
        </th>
      </tr>
      {indicators.map((ind) => {
        const best = bestIsoN(ind, countries);
        const isActiveRow = ind.key === activeKey;
        return (
          <tr key={ind.key}>
            <th
              scope="row"
              className={`sticky left-0 z-10 w-[15rem] border-b border-r border-border px-5 py-5 text-left align-middle sm:px-8 ${
                isActiveRow ? "bg-surface-2" : "bg-surface"
              }`}
            >
              <div className="text-sm font-medium leading-tight text-foreground">
                {ind.label}
              </div>
              {ind.unit && (
                <div className="mt-0.5 text-[11px] text-muted">{ind.unit}</div>
              )}
            </th>
            {countries.map((c) => (
              <Cell
                key={c.isoN}
                ind={ind}
                country={c}
                countries={countries}
                isBest={best === c.isoN}
              />
            ))}
          </tr>
        );
      })}
    </>
  );
}
