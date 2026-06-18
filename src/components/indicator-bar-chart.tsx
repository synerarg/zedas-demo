"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { INDICATORS, type Country } from "@/lib/zedas-data";
import {
  formatIndicator,
  formatNumber,
  INDICATOR_LAYERS,
  normalizedToMax,
} from "@/lib/layers";

// One distinct, AA-contrast color per indicator (gradient high endpoints).
const INDICATOR_COLOR: Record<string, string> = {
  availability: "#0F766E",
  stress: "#B23A48",
  efficiency: "#1E40AF",
};

interface Props {
  country: Country;
}

export default function IndicatorBarChart({ country }: Props) {
  const data = INDICATOR_LAYERS.map((layer) => {
    const key = layer.indicatorKey;
    const raw = country[key];
    return {
      key,
      label: INDICATORS[key].label,
      pct: Math.round(normalizedToMax(key, raw) * 100),
      display: formatIndicator(key, raw),
      num: formatNumber(raw),
      color: INDICATOR_COLOR[key],
    };
  });

  const summary = data
    .map((d) => `${d.label}: ${d.display} (${d.pct}% of pilot maximum)`)
    .join("; ");

  return (
    <figure className="m-0">
      <div
        className="tnum h-[176px] w-full"
        role="img"
        aria-label={`Indicator chart for ${country.name}. ${summary}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 4, right: 64, bottom: 16, left: 8 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--color-border)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{
                fontSize: 10,
                fill: "var(--color-muted)",
              }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={false}
              label={{
                value: "Share of 16-country pilot maximum",
                position: "insideBottom",
                offset: -8,
                fontSize: 10,
                fill: "var(--color-muted)",
              }}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              tick={{ fontSize: 11, fill: "var(--color-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--color-surface-2)", opacity: 0.5 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as (typeof data)[number];
                return (
                  <div className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs shadow-md">
                    <p className="font-medium text-foreground">{d.label}</p>
                    <p className="tnum text-[11px] text-foreground/80">
                      {d.display}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="pct" radius={[0, 4, 4, 0]} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
              <LabelList
                dataKey="num"
                position="right"
                offset={8}
                style={{
                  fontSize: 11,
                  fontVariantNumeric: "tabular-nums",
                  fill: "var(--color-foreground)",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
