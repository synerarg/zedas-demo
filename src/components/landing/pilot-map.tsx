"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { getCountryByGeoId, type Country } from "@/lib/zedas-data";
import { MAP_HEIGHT, MAP_SCALE, MAP_WIDTH } from "@/lib/layers";
import Flag from "@/components/flag";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/** Static (no zoom/pan) world map for the landing's pilot section. The 16 pilot
 *  countries stand out in the accent color; the rest of the world is muted.
 *  Hovering a pilot country shows a small name + region card — no indicators. */
export default function PilotMap() {
  const [hovered, setHovered] = useState<Country | null>(null);

  // Imperative tooltip positioning so following the pointer never re-renders the
  // map; the card content only changes when the hovered country changes.
  const tipRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef({ w: 180, h: 64 });
  const posRef = useRef({ x: 0, y: 0 });

  const place = useCallback(() => {
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
    place();
  }, [hovered, place]);

  return (
    <div
      className="relative"
      role="img"
      aria-label="World map highlighting the sixteen ZEDAS pilot countries across Latin America, Africa, and Asia."
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: MAP_SCALE }}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = getCountryByGeoId(geo.id);
              const isPilot = Boolean(country);
              const base = {
                fill: isPilot ? "var(--accent)" : "var(--no-data)",
                stroke: "var(--map-stroke)",
                strokeWidth: 0.4,
                outline: "none",
                transition: "fill 150ms ease-out, filter 150ms ease-out",
              } as const;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={(e) => {
                    if (!country) return;
                    posRef.current = { x: e.clientX, y: e.clientY };
                    setHovered(country);
                  }}
                  onMouseMove={(e) => {
                    if (!country) return;
                    posRef.current = { x: e.clientX, y: e.clientY };
                    place();
                  }}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    default: base,
                    hover: {
                      ...base,
                      strokeWidth: isPilot ? 0.8 : 0.4,
                      filter: isPilot ? "brightness(1.12)" : undefined,
                    },
                    pressed: base,
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {hovered && (
        <div
          ref={tipRef}
          role="tooltip"
          aria-hidden
          className="zd-tip-in pointer-events-none fixed left-0 top-0 z-[var(--z-tooltip)] w-max max-w-[220px] rounded-lg border border-border bg-surface p-2.5 shadow-lg"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Flag isoN={hovered.isoN} className="h-3.5 w-auto" />
            <span>{hovered.name}</span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted">{hovered.region}</p>
        </div>
      )}
    </div>
  );
}
