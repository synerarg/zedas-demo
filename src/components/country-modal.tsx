"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, Plus, X } from "lucide-react";
import { INDICATORS, type Country } from "@/lib/zedas-data";
import { FLAGS, formatNumber, INDICATOR_LAYERS } from "@/lib/layers";
import ScorePill from "./score-pill";
import IndicatorBarChart from "./indicator-bar-chart";

const NBSP = " ";

interface CountryModalProps {
  country: Country | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inComparison: boolean;
  onToggleComparison: (isoN: number) => void;
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
          className="fixed inset-x-0 bottom-0 z-[var(--z-modal)] max-h-[88dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 shadow-2xl [overscroll-behavior:contain] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[min(34rem,92vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:pb-5"
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
                    Water profile — pilot release
                  </Dialog.Description>
                  <div className="mt-2.5">
                    <ScorePill profile={country.profile} />
                  </div>
                </div>
                <Dialog.Close
                  aria-label="Close"
                  className="-mr-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <X className="size-5" aria-hidden />
                </Dialog.Close>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {INDICATOR_LAYERS.map((layer) => {
                  const key = layer.indicatorKey;
                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-border bg-surface-2/50 p-3"
                    >
                      <dt className="text-[11px] leading-tight text-muted">
                        {INDICATORS[key].label}
                      </dt>
                      <dd className="mt-1 flex items-baseline gap-1">
                        <span className="tnum text-lg font-medium text-foreground">
                          {formatNumber(country[key])}
                        </span>
                        <span className="text-[11px] text-muted">
                          {INDICATORS[key].unit}
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-4">
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  Indicators
                </h3>
                <IndicatorBarChart country={country} />
              </div>

              <div className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted">
                <p className="break-words">
                  Pilot data steward: {country.focalPoint}
                  {country.affiliation && country.affiliation !== "—"
                    ? ` ${NBSP}·${NBSP} ${country.affiliation}`
                    : ""}
                </p>
                <p>Source: {country.source}</p>
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
