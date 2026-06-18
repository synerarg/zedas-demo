"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  COUNTRY_BY_ISON,
  INDICATORS,
  PROFILE_COLOR,
  type Country,
} from "@/lib/zedas-data";
import {
  countryFill,
  FLAGS,
  formatNumber,
  indicatorRank,
  INDICATOR_COLOR,
  INDICATOR_LAYERS,
  layerValueText,
  MAP_COLORS,
  MAP_WIDTH,
  MAP_HEIGHT,
  MAP_SCALE,
  MIN_ZOOM,
  MAX_ZOOM,
  normalizedToMax,
  PILOT_COUNT,
  profileTextColor,
  TRANSLATE_EXTENT,
  type IndicatorKey,
  type LayerDef,
} from "@/lib/layers";

// Short labels for the tooltip's three mini bars.
const MINI_LABEL: Record<IndicatorKey, string> = {
  availability: "Availability",
  stress: "Quality",
  efficiency: "Resilience",
};

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

interface WorldMapProps {
  layer: LayerDef;
  theme: "light" | "dark";
  position: MapPosition;
  onPositionChange: (p: MapPosition) => void;
  onSelectCountry: (isoN: number) => void;
}

interface Hovered {
  country: Country | null;
  name: string;
}

function matchCountry(geo: {
  id?: string | number;
  properties?: { name?: string };
}): Country | undefined {
  const byId = COUNTRY_BY_ISON[Number(geo.id)];
  if (byId) return byId;
  const name = geo.properties?.name;
  if (!name) return undefined;
  return Object.values(COUNTRY_BY_ISON).find((c) => c.name === name);
}

export default function WorldMap({
  layer,
  theme,
  position,
  onPositionChange,
  onSelectCountry,
}: WorldMapProps) {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const colors = MAP_COLORS[theme];

  // Tooltip positioning is handled imperatively (via refs) so following the
  // pointer never re-renders the card; the card content only re-renders when
  // the hovered country or active layer changes.
  const tipRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef({ w: 260, h: 140 });
  const posRef = useRef({ x: 0, y: 0 });

  const placeTooltip = useCallback(() => {
    const el = tipRef.current;
    if (!el) return;
    const { w, h } = dimsRef.current;
    const { x, y } = posRef.current;
    const pad = 8;
    const offX = 14;
    const offY = 16;
    // Use the layout viewport (reliable across environments / excludes scrollbar).
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    let left = x + offX;
    let top = y + offY;
    // Flip toward the pointer, then clamp so the card never leaves the viewport.
    if (left + w + pad > vw) left = x - w - offX;
    if (top + h + pad > vh) top = y - h - offY;
    left = Math.min(Math.max(pad, left), vw - w - pad);
    top = Math.min(Math.max(pad, top), vh - h - pad);
    el.style.transform = `translate(${left}px, ${top}px)`;
  }, []);

  // Measure the card once its content changes, then place it before paint.
  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el) return;
    dimsRef.current = { w: el.offsetWidth, h: el.offsetHeight };
    placeTooltip();
  }, [hovered, layer, placeTooltip]);

  const activeKey: IndicatorKey | null =
    layer.kind === "gradient" ? layer.indicatorKey! : null;
  const tipCountry = hovered?.country ?? null;

  return (
    <div
      className="absolute inset-0 [touch-action:manipulation]"
      aria-hidden="false"
      role="img"
      aria-label="World map. Sixteen pilot countries are colored by the active water layer; all other countries show no data. Use the country search to open a country's detail."
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: MAP_SCALE }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          translateExtent={TRANSLATE_EXTENT}
          onMoveEnd={(pos) =>
            onPositionChange({
              coordinates: pos.coordinates as [number, number],
              zoom: pos.zoom,
            })
          }
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = matchCountry(geo);
                const isPilot = Boolean(country);
                const fill = country
                  ? countryFill(layer, country)
                  : colors.noData;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={isPilot ? 0 : -1}
                    role={isPilot ? "button" : undefined}
                    aria-label={
                      country
                        ? `${country.name}, ${layerValueText(layer, country)}. Open detail.`
                        : undefined
                    }
                    onMouseEnter={(e) => {
                      posRef.current = { x: e.clientX, y: e.clientY };
                      setHovered({
                        country: country ?? null,
                        name: country?.name ?? geo.properties?.name ?? "",
                      });
                    }}
                    onMouseMove={(e) => {
                      posRef.current = { x: e.clientX, y: e.clientY };
                      placeTooltip();
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => country && onSelectCountry(country.isoN)}
                    onKeyDown={(e) => {
                      if (country && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onSelectCountry(country.isoN);
                      }
                    }}
                    style={{
                      default: {
                        fill,
                        stroke: colors.stroke,
                        strokeWidth: 0.4,
                        outline: "none",
                        cursor: isPilot ? "pointer" : "default",
                        transition: "fill 150ms ease-out",
                      },
                      hover: {
                        fill,
                        stroke: isPilot ? colors.strokeStrong : colors.stroke,
                        strokeWidth: isPilot ? 0.9 : 0.4,
                        outline: "none",
                        cursor: isPilot ? "pointer" : "default",
                        filter: isPilot ? "brightness(1.06)" : undefined,
                      },
                      pressed: {
                        fill,
                        stroke: colors.strokeStrong,
                        strokeWidth: 1,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {hovered && (
        <div
          ref={tipRef}
          role="tooltip"
          aria-hidden
          className="zd-tip-in pointer-events-none fixed left-0 top-0 z-[var(--z-tooltip)] w-[260px] max-w-[260px] rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-sm"
        >
          {tipCountry ? (
            <>
              {/* Headline: Zedas Score profile on its category color */}
              <span
                className="inline-block max-w-full rounded-md px-2 py-1 text-[11px] font-medium leading-snug"
                style={{
                  backgroundColor: PROFILE_COLOR[tipCountry.profile],
                  color: profileTextColor(tipCountry.profile),
                }}
              >
                {tipCountry.profile}
              </span>

              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <span aria-hidden className="text-base leading-none">
                  {FLAGS[tipCountry.isoN]}
                </span>
                <span className="truncate">{tipCountry.name}</span>
              </p>

              {/* Active indicator value + rank (skipped on the Zedas Score layer) */}
              {activeKey && (
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="tnum text-lg font-semibold text-foreground">
                    {formatNumber(tipCountry[activeKey])}
                    <span className="ml-1 text-[11px] font-normal text-muted">
                      {INDICATORS[activeKey].unit}
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-[11px] text-muted">
                    Rank #{indicatorRank(activeKey, tipCountry.isoN)} of{" "}
                    {PILOT_COUNT}
                  </span>
                </div>
              )}

              {/* Three mini bars, active indicator highlighted */}
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {INDICATOR_LAYERS.map((l) => {
                  const key = l.indicatorKey;
                  const isActive = key === activeKey;
                  const dimmed = activeKey != null && !isActive;
                  const pct = Math.round(
                    normalizedToMax(key, tipCountry[key]) * 100,
                  );
                  return (
                    <div key={key} className="min-w-0">
                      <p
                        className={`truncate text-[10px] leading-tight ${
                          isActive ? "font-medium text-foreground" : "text-muted"
                        }`}
                      >
                        {MINI_LABEL[key]}
                      </p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: INDICATOR_COLOR[key],
                            opacity: dimmed ? 0.4 : 1,
                          }}
                        />
                      </div>
                      <p className="tnum mt-1 text-[10px] text-foreground/70">
                        {formatNumber(tipCountry[key])}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2.5 text-[11px] text-muted">
                Click for full profile →
              </p>
            </>
          ) : (
            <>
              <p className="truncate text-sm font-semibold text-foreground">
                {hovered.name || "Unknown"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                Not in the 16-country pilot · No data
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
