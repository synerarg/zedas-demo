"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, GitCompareArrows } from "lucide-react";
import {
  COUNTRY_BY_ISON,
  DEFAULT_INDICATOR,
  getIndicator,
  type IndicatorKey,
} from "@/lib/zedas-data";
import { CENTROIDS, clampCenter } from "@/lib/layers";
import type { MapPosition } from "./world-map";
import LeftPanel from "./left-panel";
import CountryDetail from "./country-detail";
import CompareTray from "./compare-tray";
import ComparisonView from "./comparison-view";
import CountrySearch from "./country-search";

const WorldMap = dynamic(() => import("./world-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

/** Comparison holds at most this many countries (kept readable side by side). */
const MAX_COMPARE = 4;

function MapSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-3" aria-hidden>
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="text-xs text-muted">Loading map…</span>
      </div>
      <span className="sr-only" role="status">
        Loading the world map.
      </span>
    </div>
  );
}

export default function ZedasApp() {
  const [activeKey, setActiveKey] = useState<IndicatorKey>(DEFAULT_INDICATOR);
  const [position, setPosition] = useState<MapPosition>({
    coordinates: [0, 0],
    zoom: 1,
  });
  const [selectedIsoN, setSelectedIsoN] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [comparison, setComparison] = useState<number[]>([]);
  const [announce, setAnnounce] = useState("");

  // ⌘K / Ctrl+K opens the country search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const indicator = getIndicator(activeKey);
  const comparisonFull = comparison.length >= MAX_COMPARE;
  const selectedCountry =
    selectedIsoN != null ? COUNTRY_BY_ISON[selectedIsoN] : null;
  const comparisonCountries = useMemo(
    () => comparison.map((iso) => COUNTRY_BY_ISON[iso]).filter(Boolean),
    [comparison],
  );

  const openCountry = useCallback((isoN: number) => {
    setSelectedIsoN(isoN);
    setDetailOpen(true);
  }, []);

  const toggleComparison = useCallback((isoN: number) => {
    setComparison((prev) => {
      const exists = prev.includes(isoN);
      const name = COUNTRY_BY_ISON[isoN]?.name ?? "Country";
      if (exists) {
        setAnnounce(`${name} removed from comparison.`);
        return prev.filter((i) => i !== isoN);
      }
      if (prev.length >= MAX_COMPARE) {
        setAnnounce(
          `Comparison is full — up to ${MAX_COMPARE} countries. Remove one first.`,
        );
        return prev;
      }
      setAnnounce(`${name} added to comparison.`);
      return [...prev, isoN];
    });
  }, []);

  // In select mode a map click toggles comparison membership; otherwise it
  // opens the country detail.
  const handleMapSelect = useCallback(
    (isoN: number) => {
      if (selectMode) toggleComparison(isoN);
      else openCountry(isoN);
    },
    [selectMode, toggleComparison, openCountry],
  );

  // Entering select mode closes the detail panel so there's a single focus.
  const toggleSelectMode = useCallback(() => {
    setSelectMode((on) => {
      if (!on) setDetailOpen(false);
      return !on;
    });
  }, []);

  const focusCountry = useCallback((isoN: number) => {
    // From search: recenter the map (clamped to keep the world in view), then
    // open the detail panel.
    const c = CENTROIDS[isoN];
    if (c) setPosition({ coordinates: clampCenter(c, 2.2), zoom: 2.2 });
    setSearchOpen(false);
    setSelectMode(false);
    setSelectedIsoN(isoN);
    setDetailOpen(true);
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* Map canvas — the hero */}
      <div className="absolute inset-0 z-[var(--z-map)]">
        <WorldMap
          indicator={indicator}
          position={position}
          onPositionChange={setPosition}
          onSelectCountry={handleMapSelect}
          selectedIsoN={detailOpen ? selectedIsoN : null}
          selectMode={selectMode}
          comparedIsoNs={comparison}
          comparisonFull={comparisonFull}
        />
      </div>

      {/* Chrome overlay */}
      <div className="pointer-events-none absolute inset-0 z-[var(--z-chrome)]">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4">
          <div className="pointer-events-auto w-[15.5rem] rounded-xl border border-border bg-surface/95 px-3.5 py-2.5 shadow-sm sm:w-[16.5rem]">
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              ZEDAS Project
            </h1>
            <p className="mt-0.5 text-[11px] leading-tight text-muted sm:text-xs">
              Global water intelligence — pilot release
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSelectMode}
              aria-pressed={selectMode}
              className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                selectMode
                  ? "border-transparent bg-accent text-accent-foreground hover:brightness-95"
                  : "border-border bg-surface/95 text-foreground hover:bg-surface-2"
              }`}
            >
              <GitCompareArrows className="size-4" aria-hidden />
              <span className="hidden sm:inline">
                {selectMode ? "Done" : "Compare"}
              </span>
              {comparison.length > 0 && (
                <span
                  className={`tnum rounded-full px-1.5 text-xs ${
                    selectMode
                      ? "bg-white/20"
                      : "bg-surface-2 text-muted"
                  }`}
                >
                  {comparison.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search countries"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface/95 px-3 text-sm text-muted shadow-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Search className="size-4" aria-hidden />
              <span className="hidden sm:inline">Search…</span>
            </button>
          </div>
        </div>

        {/* Left panel: layers, adaptive legend, insight, upload */}
        <div className="pointer-events-none absolute bottom-4 left-3 top-[5.5rem] w-[15.5rem] pb-[env(safe-area-inset-bottom)] sm:left-4 sm:w-[16.5rem]">
          <LeftPanel active={activeKey} onChange={setActiveKey} />
        </div>
      </div>

      <CountrySearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={focusCountry}
      />

      <CountryDetail
        country={selectedCountry}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        inComparison={selectedIsoN != null && comparison.includes(selectedIsoN)}
        comparisonFull={comparisonFull}
        onToggleComparison={toggleComparison}
      />

      {(comparison.length > 0 || selectMode) && !detailOpen && !comparisonOpen && (
        <CompareTray
          countries={comparisonCountries}
          selectMode={selectMode}
          full={comparisonFull}
          onToggleSelectMode={toggleSelectMode}
          onRemove={toggleComparison}
          onClear={() => {
            setComparison([]);
            setSelectMode(false);
            setAnnounce("Comparison cleared.");
          }}
          onOpen={() => {
            setSelectMode(false);
            setComparisonOpen(true);
          }}
        />
      )}

      <ComparisonView
        open={comparisonOpen}
        onClose={() => setComparisonOpen(false)}
        countries={comparisonCountries}
        activeKey={activeKey}
        onRemove={toggleComparison}
        onClear={() => {
          setComparison([]);
          setAnnounce("Comparison cleared.");
        }}
        onAddMore={() => {
          setComparisonOpen(false);
          setSelectMode(true);
        }}
      />

      <div aria-live="polite" className="sr-only">
        {announce}
      </div>
    </main>
  );
}
