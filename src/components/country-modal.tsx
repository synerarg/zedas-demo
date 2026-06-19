"use client";

import * as Dialog from "@radix-ui/react-dialog";
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
import { FLAGS } from "@/lib/layers";

interface CountryModalProps {
  country: Country | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inComparison: boolean;
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
            <span className="tnum">
              {formatNumber(sector.value(country), 1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IndicatorRow({
  ind,
  country,
}: {
  ind: Indicator;
  country: Country;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/50 p-3">
      <div className="text-[11px] leading-tight text-muted">{ind.label}</div>
      {ind.scale === "sequential" ? (
        <>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="tnum text-base font-medium text-foreground">
              {ind.format(country)}
            </span>
            {ind.rank !== null && (
              <span className="tnum text-[11px] text-muted">
                World rank #{ind.rank(country)}
              </span>
            )}
          </div>
          {ind.key === "totalWithdrawal" && (
            <WithdrawalSplit country={country} />
          )}
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

export default function CountryModal({
  country,
  open,
  onOpenChange,
  inComparison,
  onToggleComparison,
}: CountryModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          data-zd-overlay
          className="fixed inset-0 z-[var(--z-overlay)] bg-black/45 backdrop-blur-[2px]"
        />
        <Dialog.Content
          data-zd-modal
          aria-describedby="country-modal-desc"
          className="fixed inset-x-0 bottom-0 z-[var(--z-modal)] max-h-[88dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 shadow-2xl [overscroll-behavior:contain] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(38rem,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5"
        >
          {country && (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Dialog.Title className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-foreground">
                    <span aria-hidden className="text-2xl leading-none">
                      {FLAGS[country.isoN]}
                    </span>
                    <span className="truncate">{country.name}</span>
                  </Dialog.Title>
                  <Dialog.Description
                    id="country-modal-desc"
                    className="mt-1 text-xs text-muted"
                  >
                    {country.region}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label="Close"
                  className="-mr-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>

              <div className="mt-4 space-y-4">
                {GROUPED_INDICATORS.map(({ group, indicators }) => (
                  <section key={group}>
                    <h3 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {group}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {indicators.map((ind) => (
                        <IndicatorRow
                          key={ind.key}
                          ind={ind}
                          country={country}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-3 text-[11px] text-muted">
                <div>
                  <p className="font-medium text-foreground/80">Sources</p>
                  <ul className="mt-0.5 space-y-0.5">
                    {sourceLines().map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <p className="break-words">{DATA_NOTE}</p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => onToggleComparison(country.isoN)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto ${
                    inComparison
                      ? "border border-border bg-surface text-foreground hover:bg-surface-2"
                      : "bg-accent text-accent-foreground hover:brightness-95"
                  }`}
                >
                  {inComparison ? (
                    <>
                      <Check className="size-4" aria-hidden />
                      Remove from comparison
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" aria-hidden />
                      Add to comparison
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
