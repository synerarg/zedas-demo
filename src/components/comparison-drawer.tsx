"use client";

import { X } from "lucide-react";
import {
  GROUPED_INDICATORS,
  indicatorCategory,
  indicatorFraction,
  sourceLines,
  type Country,
  type Indicator,
  type IndicatorKey,
} from "@/lib/zedas-data";
import { FLAGS } from "@/lib/layers";

interface ComparisonDrawerProps {
  open: boolean;
  onClose: () => void;
  countries: Country[];
  activeKey: IndicatorKey;
  onRemove: (isoN: number) => void;
  onClear: () => void;
}

export default function ComparisonDrawer({
  open,
  onClose,
  countries,
  activeKey,
  onRemove,
  onClear,
}: ComparisonDrawerProps) {
  if (!open) return null;

  const hasCountries = countries.length > 0;

  return (
    <aside
      role="complementary"
      aria-label="Country comparison"
      data-zd-drawer
      data-state="open"
      className="fixed inset-y-0 right-0 z-[var(--z-drawer)] flex h-dvh w-full flex-col border-l border-border bg-surface shadow-2xl pb-[env(safe-area-inset-bottom)] sm:w-[min(35rem,94vw)]"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Comparison
          </h2>
          {hasCountries && (
            <p className="tnum mt-0.5 text-xs text-muted">
              {countries.length}{" "}
              {countries.length === 1 ? "country" : "countries"}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {hasCountries && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </header>

      {!hasCountries ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <p className="text-balance text-[15px] leading-relaxed text-muted">
            No countries yet. Open a country and tap “Add to comparison”.
          </p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto [overscroll-behavior:contain]">
            <table className="w-max border-collapse">
              <caption className="sr-only">
                Water indicators compared across the selected countries. Each
                row is one indicator; each column is one country.
              </caption>
              <thead>
                <tr>
                  {/* corner */}
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-28 border-b border-r border-border bg-surface"
                  >
                    <span className="sr-only">Indicator</span>
                  </th>
                  {countries.map((c) => (
                    <th
                      key={c.isoN}
                      scope="col"
                      className="w-36 border-b border-border px-4 pb-4 pt-2 text-left align-top"
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onRemove(c.isoN)}
                          aria-label={`Remove ${c.name} from comparison`}
                          className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      </div>
                      <p className="-mt-1 flex items-center gap-1.5 text-base font-semibold leading-tight text-foreground">
                        <span
                          aria-hidden
                          className="shrink-0 text-sm leading-none"
                        >
                          {FLAGS[c.isoN]}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </p>
                      <p className="mt-1 text-xs leading-snug text-muted">
                        {c.region}
                      </p>
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
                  />
                ))}
              </tbody>
            </table>

            <div className="px-5 py-4 text-xs leading-relaxed text-muted">
              <p>
                Bars are scaled to the highest value among the compared
                countries.
              </p>
              {sourceLines().map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function GroupRows({
  group,
  indicators,
  countries,
  activeKey,
}: {
  group: string;
  indicators: Indicator[];
  countries: Country[];
  activeKey: IndicatorKey;
}) {
  const colSpan = countries.length + 1;
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={colSpan}
          className="sticky left-0 z-10 border-b border-border bg-surface-2 px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted"
        >
          {group}
        </th>
      </tr>
      {indicators.map((ind) => {
        const isActiveRow = ind.key === activeKey;
        const max =
          ind.scale === "sequential"
            ? Math.max(...countries.map((x) => ind.numericValue(x)))
            : 0;
        return (
          <tr key={ind.key}>
            <th
              scope="row"
              className={`sticky left-0 z-10 border-b border-r border-border px-4 py-4 text-left align-middle ${
                isActiveRow ? "bg-surface-2" : "bg-surface"
              }`}
            >
              <div className="min-w-0">
                <div
                  className={`text-sm leading-tight text-foreground ${
                    isActiveRow ? "font-semibold" : "font-medium"
                  }`}
                >
                  {ind.label}
                </div>
                {ind.unit && (
                  <div className="text-xs text-muted">{ind.unit}</div>
                )}
              </div>
            </th>
            {countries.map((c) => (
              <td
                key={c.isoN}
                className={`border-b border-border px-4 py-4 align-middle ${
                  isActiveRow ? "bg-surface-2" : ""
                }`}
              >
                {ind.scale === "sequential" ? (
                  <>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="tnum text-[15px] font-medium text-foreground">
                        {ind.format(c)}
                      </span>
                      {ind.rank && (
                        <span className="tnum shrink-0 text-xs text-muted">
                          #{ind.rank(c)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(
                            indicatorFraction(ind, c, [0, max]) * 100,
                          )}%`,
                          backgroundColor: ind.ramp[1],
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: indicatorCategory(ind, c).color }}
                    />
                    <span className="text-[15px] font-medium leading-tight text-foreground">
                      {indicatorCategory(ind, c).label}
                    </span>
                    {ind.unit && (
                      <span className="tnum shrink-0 text-xs text-muted">
                        {ind.format(c)}
                      </span>
                    )}
                  </div>
                )}
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}
