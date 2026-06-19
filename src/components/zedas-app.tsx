"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Layers } from "lucide-react";
import {
  COUNTRY_BY_ISON,
  DEFAULT_INDICATOR,
  getIndicator,
  type IndicatorKey,
} from "@/lib/zedas-data";
import { CENTROIDS, clampCenter } from "@/lib/layers";
import { useTheme } from "@/lib/use-theme";
import type { MapPosition } from "./world-map";
import LeftPanel from "./left-panel";
import CountryModal from "./country-modal";
import ComparisonDrawer from "./comparison-drawer";
import CountrySearch from "./country-search";
import ThemeToggle from "./theme-toggle";

const WorldMap = dynamic(() => import("./world-map"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

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
  const { theme, toggle: toggleTheme } = useTheme();
  const [activeKey, setActiveKey] = useState<IndicatorKey>(DEFAULT_INDICATOR);
  const [position, setPosition] = useState<MapPosition>({
    coordinates: [0, 0],
    zoom: 1,
  });
  const [selectedIsoN, setSelectedIsoN] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
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
  const selectedCountry =
    selectedIsoN != null ? COUNTRY_BY_ISON[selectedIsoN] : null;
  const comparisonCountries = useMemo(
    () => comparison.map((iso) => COUNTRY_BY_ISON[iso]).filter(Boolean),
    [comparison],
  );

  const openCountry = useCallback((isoN: number) => {
    setSelectedIsoN(isoN);
    setModalOpen(true);
  }, []);

  const focusCountry = useCallback((isoN: number) => {
    // From search: recenter the map (clamped to keep the world in view), then
    // open the modal.
    const c = CENTROIDS[isoN];
    if (c) setPosition({ coordinates: clampCenter(c, 2.2), zoom: 2.2 });
    setSearchOpen(false);
    setSelectedIsoN(isoN);
    setModalOpen(true);
  }, []);

  const toggleComparison = useCallback((isoN: number) => {
    setComparison((prev) => {
      const exists = prev.includes(isoN);
      const name = COUNTRY_BY_ISON[isoN]?.name ?? "Country";
      if (exists) {
        setAnnounce(`${name} removed from comparison.`);
        return prev.filter((i) => i !== isoN);
      }
      setAnnounce(`${name} added to comparison.`);
      setCompareOpen(true);
      return [...prev, isoN];
    });
  }, []);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* Map canvas — the hero */}
      <div className="absolute inset-0 z-[var(--z-map)]">
        <WorldMap
          indicator={indicator}
          theme={theme}
          position={position}
          onPositionChange={setPosition}
          onSelectCountry={openCountry}
        />
      </div>

      {/* Chrome overlay */}
      <div className="pointer-events-none absolute inset-0 z-[var(--z-chrome)]">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4">
          <div className="pointer-events-auto rounded-xl border border-border bg-surface/85 px-3.5 py-2.5 shadow-sm backdrop-blur-md">
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              ZEDAS Project
            </h1>
            <p className="mt-0.5 text-[11px] leading-tight text-muted sm:text-xs">
              Global water intelligence — pilot release
            </p>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {comparison.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareOpen((o) => !o)}
                aria-expanded={compareOpen}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface/90 px-3 text-sm font-medium text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Layers className="size-4 text-muted" aria-hidden />
                <span className="hidden sm:inline">Comparison</span>
                <span className="tnum text-xs text-muted">
                  {comparison.length}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search countries"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface/90 px-3 text-sm text-muted shadow-sm backdrop-blur-md transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Search className="size-4" aria-hidden />
              <span className="hidden sm:inline">Search…</span>
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
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

      <CountryModal
        country={selectedCountry}
        open={modalOpen}
        onOpenChange={setModalOpen}
        inComparison={selectedIsoN != null && comparison.includes(selectedIsoN)}
        onToggleComparison={toggleComparison}
      />

      <ComparisonDrawer
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        countries={comparisonCountries}
        activeKey={activeKey}
        onRemove={toggleComparison}
        onClear={() => {
          setComparison([]);
          setAnnounce("Comparison cleared.");
        }}
      />

      <div aria-live="polite" className="sr-only">
        {announce}
      </div>
    </main>
  );
}
