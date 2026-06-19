"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  getCountryByGeoId,
  indicatorCategory,
  indicatorColor,
  type Country,
  type Indicator,
} from "@/lib/zedas-data";
import {
  FLAGS,
  MAP_COLORS,
  MAP_WIDTH,
  MAP_HEIGHT,
  MAP_SCALE,
  MIN_ZOOM,
  MAX_ZOOM,
  TRANSLATE_EXTENT,
} from "@/lib/layers";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

interface WorldMapProps {
  indicator: Indicator;
  theme: "light" | "dark";
  position: MapPosition;
  onPositionChange: (p: MapPosition) => void;
  onSelectCountry: (isoN: number) => void;
}

interface Hovered {
  country: Country | null;
  name: string;
}

export default function WorldMap({
  indicator,
  theme,
  position,
  onPositionChange,
  onSelectCountry,
}: WorldMapProps) {
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const colors = MAP_COLORS[theme];

  // Tooltip positioning is handled imperatively (via refs) so following the
  // pointer never re-renders the card; the card content only re-renders when
  // the hovered country or active indicator changes.
  const tipRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef({ w: 240, h: 140 });
  const posRef = useRef({ x: 0, y: 0 });

  const placeTooltip = useCallback(() => {
    const el = tipRef.current;
    if (!el) return;
    const { w, h } = dimsRef.current;
    const { x, y } = posRef.current;
    const pad = 8;
    const offX = 14;
    const offY = 16;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    let left = x + offX;
    let top = y + offY;
    if (left + w + pad > vw) left = x - w - offX;
    if (top + h + pad > vh) top = y - h - offY;
    left = Math.min(Math.max(pad, left), vw - w - pad);
    top = Math.min(Math.max(pad, top), vh - h - pad);
    el.style.transform = `translate(${left}px, ${top}px)`;
  }, []);

  useLayoutEffect(() => {
    const el = tipRef.current;
    if (!el) return;
    dimsRef.current = { w: el.offsetWidth, h: el.offsetHeight };
    placeTooltip();
  }, [hovered, indicator, placeTooltip]);

  const tipCountry = hovered?.country ?? null;

  return (
    <div
      className="absolute inset-0 [touch-action:manipulation]"
      role="group"
      aria-label="World map. Sixteen pilot countries are colored by the active indicator; all other countries show no data. Pilot countries are focusable; press Enter to open a country's detail, or use the country search."
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
                const country = getCountryByGeoId(geo.id);
                const isPilot = Boolean(country);
                const fill = country
                  ? indicatorColor(indicator, country)
                  : colors.noData;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    tabIndex={isPilot ? 0 : -1}
                    role={isPilot ? "button" : undefined}
                    aria-label={
                      country
                        ? `${country.name}, ${indicator.label}: ${indicator.format(country)}. Open detail.`
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
          className="zd-tip-in pointer-events-none fixed left-0 top-0 z-[var(--z-tooltip)] w-[240px] max-w-[240px] rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-sm"
        >
          {tipCountry ? (
            <>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <span aria-hidden className="text-base leading-none">
                  {FLAGS[tipCountry.isoN]}
                </span>
                <span className="truncate">{tipCountry.name}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted">{tipCountry.region}</p>

              <div className="mt-2.5 border-t border-border pt-2.5">
                <p className="text-[11px] text-muted">{indicator.label}</p>
                {indicator.scale === "sequential" ? (
                  <div className="mt-0.5 flex items-baseline justify-between gap-2">
                    <span className="tnum text-base font-semibold text-foreground">
                      {indicator.format(tipCountry)}
                    </span>
                    {indicator.rank && (
                      <span className="tnum shrink-0 text-[11px] text-muted">
                        World rank #{indicator.rank(tipCountry)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: indicatorCategory(indicator, tipCountry).color,
                        }}
                      />
                      {indicatorCategory(indicator, tipCountry).label}
                    </span>
                    {indicator.unit && (
                      <span className="tnum shrink-0 text-[11px] text-muted">
                        {indicator.format(tipCountry)}
                      </span>
                    )}
                  </div>
                )}
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
