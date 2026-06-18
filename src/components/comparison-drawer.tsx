"use client";

import { X } from "lucide-react";
import { INDICATORS, PROFILE_COLOR, type Country } from "@/lib/zedas-data";
import {
  FLAGS,
  formatNumber,
  INDICATOR_COLOR,
  INDICATOR_LAYERS,
  profileTextColor,
  type LayerId,
} from "@/lib/layers";

interface ComparisonDrawerProps {
  open: boolean;
  onClose: () => void;
  countries: Country[];
  activeLayer: LayerId;
  onRemove: (isoN: number) => void;
  onClear: () => void;
}

export default function ComparisonDrawer({
  open,
  onClose,
  countries,
  activeLayer,
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
                  <th className="sticky left-0 z-10 w-28 border-b border-r border-border bg-surface" />
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
                        <span aria-hidden className="shrink-0 text-sm leading-none">
                          {FLAGS[c.isoN]}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </p>
                      <span
                        className="mt-2 inline-block rounded-md px-2 py-1 text-[11px] font-medium leading-snug"
                        style={{
                          backgroundColor: PROFILE_COLOR[c.profile],
                          color: profileTextColor(c.profile),
                        }}
                      >
                        {c.profile}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INDICATOR_LAYERS.map((l) => {
                  const key = l.indicatorKey;
                  const isActiveRow = l.id === activeLayer;
                  const rowMax = Math.max(...countries.map((c) => c[key]));
                  return (
                    <tr key={key}>
                      <th
                        scope="row"
                        className={`sticky left-0 z-10 border-b border-r border-border px-4 py-4 text-left align-middle ${
                          isActiveRow ? "bg-surface-2" : "bg-surface"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: INDICATOR_COLOR[key] }}
                          />
                          <div className="min-w-0">
                            <div
                              className={`text-sm leading-tight text-foreground ${
                                isActiveRow ? "font-semibold" : "font-medium"
                              }`}
                            >
                              {INDICATORS[key].label}
                            </div>
                            <div className="text-xs text-muted">
                              {INDICATORS[key].unit}
                            </div>
                          </div>
                        </div>
                      </th>
                      {countries.map((c) => {
                        const v = c[key];
                        const pct =
                          rowMax > 0 ? Math.max(3, (v / rowMax) * 100) : 0;
                        return (
                          <td
                            key={c.isoN}
                            className={`border-b border-border px-4 py-4 align-middle ${
                              isActiveRow ? "bg-surface-2" : ""
                            }`}
                          >
                            <div className="tnum text-[15px] font-medium text-foreground">
                              {formatNumber(v)}
                            </div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: INDICATOR_COLOR[key],
                                }}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="px-5 py-4 text-xs leading-relaxed text-muted">
              Bars are scaled to the highest value in each row. Values are
              placeholders.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
