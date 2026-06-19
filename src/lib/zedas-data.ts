// src/lib/zedas-data.ts
// ZEDAS Project — pilot dataset (16 countries) + indicator metadata.
// Self-contained, NO runtime dependencies, strict-TS clean. Components read
// everything (values, units, colours, ranks, sources) from this module.
//
// Values are an illustrative pilot extract. Vintages differ — see DATA_NOTE.

// ── Country records ──────────────────────────────────────────────────────────

export interface Country {
  name: string;
  isoA3: string;
  isoN: number; // ISO 3166-1 numeric. world-atlas geo.id drops leading zeros.
  region: "Latin America" | "Africa" | "Asia";

  // Resources
  renewableWater: number; // km³/yr
  renewableWaterRank: number; // world rank
  waterPerCapita: number; // m³/cap/yr
  waterPerCapitaRank: number; // world rank

  // Pressure
  waterStress: number; // % (SDG 6.4.2 freshwater withdrawal as share of resources)
  waterStressLevel: string; // source classification string
  totalWithdrawal: number; // km³/yr (total freshwater withdrawal, TFWW)
  withdrawalAgriculture: number; // % of withdrawal
  withdrawalIndustry: number; // % of withdrawal
  withdrawalServices: number; // % of withdrawal
  withdrawalPerCapita: number; // m³/cap

  // Trade & Economy
  virtualWaterBalance: "Net exporter" | "Net importer" | "Verify";
  virtualWaterConfidence: "high" | "medium" | "low";
  gdpPerCapita: number; // USD
  waterProductivity: number; // USD/m³
  waterProductivityRank: number; // world rank
}

export const COUNTRIES: Country[] = [
  { name: "Argentina",    isoA3: "ARG", isoN: 32,  region: "Latin America", renewableWater: 876.24, renewableWaterRank: 16,  waterPerCapita: 19388, waterPerCapitaRank: 38,  waterStress: 10.46, waterStressLevel: "No stress", totalWithdrawal: 37.69, withdrawalAgriculture: 73.93, withdrawalIndustry: 10.59, withdrawalServices: 15.48, withdrawalPerCapita: 836, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "high",   gdpPerCapita: 14357, waterProductivity: 15.89, waterProductivityRank: 104 },
  { name: "Brazil",       isoA3: "BRA", isoN: 76,  region: "Latin America", renewableWater: 8647,   renewableWaterRank: 1,   waterPerCapita: 40680, waterPerCapitaRank: 23,  waterStress: 1.48,  waterStressLevel: "No stress", totalWithdrawal: 67.19, withdrawalAgriculture: 61.64, withdrawalIndustry: 14.15, withdrawalServices: 24.00, withdrawalPerCapita: 316, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "high",   gdpPerCapita: 12313, waterProductivity: 26.89, waterProductivityRank: 80  },
  { name: "Colombia",     isoA3: "COL", isoN: 170, region: "Latin America", renewableWater: 2360,   renewableWaterRank: 6,   waterPerCapita: 46381, waterPerCapitaRank: 20,  waterStress: 4.36,  waterStressLevel: "No stress", totalWithdrawal: 29.12, withdrawalAgriculture: 85.99, withdrawalIndustry: 1.23,  withdrawalServices: 12.79, withdrawalPerCapita: 572, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 10104, waterProductivity: 22.33, waterProductivityRank: 84  },
  { name: "Mexico",       isoA3: "MEX", isoN: 484, region: "Latin America", renewableWater: 461.89, renewableWaterRank: 25,  waterPerCapita: 3582,  waterPerCapitaRank: 90,  waterStress: 44.82, waterStressLevel: "Low",       totalWithdrawal: 89.55, withdrawalAgriculture: 75.74, withdrawalIndustry: 9.55,  withdrawalServices: 14.70, withdrawalPerCapita: 695, virtualWaterBalance: "Net importer", virtualWaterConfidence: "high",   gdpPerCapita: 15779, waterProductivity: 13.98, waterProductivityRank: 110 },
  { name: "Kenya",        isoA3: "KEN", isoN: 404, region: "Africa",        renewableWater: 30.70,  renewableWaterRank: 109, waterPerCapita: 571,   waterPerCapitaRank: 148, waterStress: 33.24, waterStressLevel: "Low",       totalWithdrawal: 4.03,  withdrawalAgriculture: 80.21, withdrawalIndustry: 7.51,  withdrawalServices: 12.28, withdrawalPerCapita: 75,  virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 2714,  waterProductivity: 17.62, waterProductivityRank: 96  },
  { name: "Ethiopia",     isoA3: "ETH", isoN: 231, region: "Africa",        renewableWater: 122,    renewableWaterRank: 61,  waterPerCapita: 1061,  waterPerCapitaRank: 136, waterStress: 32.26, waterStressLevel: "Low",       totalWithdrawal: 10.55, withdrawalAgriculture: 91.84, withdrawalIndustry: 0.48,  withdrawalServices: 7.68,  withdrawalPerCapita: 92,  virtualWaterBalance: "Verify",       virtualWaterConfidence: "low",    gdpPerCapita: 1081,  waterProductivity: 7.34,  waterProductivityRank: 139 },
  { name: "Ghana",        isoA3: "GHA", isoN: 288, region: "Africa",        renewableWater: 56.20,  renewableWaterRank: 87,  waterPerCapita: 1809,  waterPerCapitaRank: 117, waterStress: 6.31,  waterStressLevel: "No stress", totalWithdrawal: 1.45,  withdrawalAgriculture: 73.06, withdrawalIndustry: 6.49,  withdrawalServices: 20.46, withdrawalPerCapita: 47,  virtualWaterBalance: "Verify",       virtualWaterConfidence: "low",    gdpPerCapita: 3314,  waterProductivity: 36.65, waterProductivityRank: 72  },
  { name: "South Africa", isoA3: "ZAF", isoN: 710, region: "Africa",        renewableWater: 104.80, renewableWaterRank: 68,  waterPerCapita: 5701,  waterPerCapitaRank: 78,  waterStress: 65.03, waterStressLevel: "Medium",    totalWithdrawal: 20.31, withdrawalAgriculture: 62.48, withdrawalIndustry: 21.31, withdrawalServices: 16.21, withdrawalPerCapita: 324, virtualWaterBalance: "Net importer", virtualWaterConfidence: "high",   gdpPerCapita: 7503,  waterProductivity: 16.69, waterProductivityRank: 100 },
  { name: "Tanzania",     isoA3: "TZA", isoN: 834, region: "Africa",        renewableWater: 96.27,  renewableWaterRank: 71,  waterPerCapita: 1612,  waterPerCapitaRank: 121, waterStress: 12.96, waterStressLevel: "No stress", totalWithdrawal: 5.18,  withdrawalAgriculture: 89.35, withdrawalIndustry: 0.48,  withdrawalServices: 10.17, withdrawalPerCapita: 821, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 1362,  waterProductivity: 10.43, waterProductivityRank: 120 },
  { name: "Uganda",       isoA3: "UGA", isoN: 800, region: "Africa",        renewableWater: 60.10,  renewableWaterRank: 84,  waterPerCapita: 1314,  waterPerCapitaRank: 132, waterStress: 5.83,  waterStressLevel: "No stress", totalWithdrawal: 0.64,  withdrawalAgriculture: 40.66, withdrawalIndustry: 7.85,  withdrawalServices: 51.49, withdrawalPerCapita: 226, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 1476,  waterProductivity: 55.07, waterProductivityRank: 52  },
  { name: "Burkina Faso", isoA3: "BFA", isoN: 854, region: "Africa",        renewableWater: 13.50,  renewableWaterRank: 129, waterPerCapita: 646,   waterPerCapitaRank: 147, waterStress: 7.82,  waterStressLevel: "No stress", totalWithdrawal: 0.82,  withdrawalAgriculture: 51.43, withdrawalIndustry: 2.65,  withdrawalServices: 45.92, withdrawalPerCapita: 39,  virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 1319,  waterProductivity: 16.30, waterProductivityRank: 102 },
  { name: "Mali",         isoA3: "MLI", isoN: 466, region: "Africa",        renewableWater: 120,    renewableWaterRank: 62,  waterPerCapita: 5926,  waterPerCapitaRank: 76,  waterStress: 8.00,  waterStressLevel: "No stress", totalWithdrawal: 5.19,  withdrawalAgriculture: 97.86, withdrawalIndustry: 0.08,  withdrawalServices: 2.06,  withdrawalPerCapita: 256, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 1301,  waterProductivity: 2.82,  waterProductivityRank: 160 },
  { name: "Nigeria",      isoA3: "NGA", isoN: 566, region: "Africa",        renewableWater: 286.20, renewableWaterRank: 34,  waterPerCapita: 1388,  waterPerCapitaRank: 127, waterStress: 9.67,  waterStressLevel: "No stress", totalWithdrawal: 12.47, withdrawalAgriculture: 44.17, withdrawalIndustry: 15.75, withdrawalServices: 40.08, withdrawalPerCapita: 61,  virtualWaterBalance: "Net importer", virtualWaterConfidence: "medium", gdpPerCapita: 1556,  waterProductivity: 38.71, waterProductivityRank: 70  },
  { name: "India",        isoA3: "IND", isoN: 356, region: "Asia",          renewableWater: 1910.90,renewableWaterRank: 8,   waterPerCapita: 1385,  waterPerCapitaRank: 128, waterStress: 66.49, waterStressLevel: "Medium",    totalWithdrawal: 647.50,withdrawalAgriculture: 90.41, withdrawalIndustry: 2.23,  withdrawalServices: 7.36,  withdrawalPerCapita: 551, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "high",   gdpPerCapita: 2813,  waterProductivity: 3.76,  waterProductivityRank: 158 },
  { name: "Nepal",        isoA3: "NPL", isoN: 524, region: "Asia",          renewableWater: 210.20, renewableWaterRank: 44,  waterPerCapita: 7214,  waterPerCapitaRank: 68,  waterStress: 8.31,  waterStressLevel: "No stress", totalWithdrawal: 9.50,  withdrawalAgriculture: 98.14, withdrawalIndustry: 0.31,  withdrawalServices: 1.55,  withdrawalPerCapita: 326, virtualWaterBalance: "Net importer", virtualWaterConfidence: "low",    gdpPerCapita: 1548,  waterProductivity: 2.81,  waterProductivityRank: 161 },
  { name: "Vietnam",      isoA3: "VNM", isoN: 704, region: "Asia",          renewableWater: 884.12, renewableWaterRank: 15,  waterPerCapita: 9083,  waterPerCapitaRank: 62,  waterStress: 18.13, waterStressLevel: "No stress", totalWithdrawal: 81.86, withdrawalAgriculture: 94.78, withdrawalIndustry: 3.75,  withdrawalServices: 1.47,  withdrawalPerCapita: 843, virtualWaterBalance: "Net exporter", virtualWaterConfidence: "medium", gdpPerCapita: 5115,  waterProductivity: 2.68,  waterProductivityRank: 162 },
];

export const COUNTRY_BY_ISON: Record<number, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.isoN, c]),
);

const BY_ISO = new Map<number, Country>(COUNTRIES.map((c) => [c.isoN, c]));

/** Join a world-atlas geography to its data. Normalizes the ISO-numeric id
 *  (world-atlas stores it without leading zeros, e.g. "76"; the source CSV used
 *  "076") so the lookup is robust to either form. */
export function getCountryByGeoId(
  geoId: string | number | undefined | null,
): Country | undefined {
  if (geoId == null) return undefined;
  const n = typeof geoId === "number" ? geoId : parseInt(geoId, 10);
  return Number.isFinite(n) ? BY_ISO.get(n) : undefined;
}

// ── Formatting ───────────────────────────────────────────────────────────────

const NBSP = " ";

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

function withUnit(value: number, digits: number, unit: string): string {
  return `${formatNumber(value, digits)}${NBSP}${unit}`;
}

// ── Indicator model ──────────────────────────────────────────────────────────

export type IndicatorGroup = "Resources" | "Pressure" | "Trade & Economy";

export const INDICATOR_GROUP_ORDER: readonly IndicatorGroup[] = [
  "Resources",
  "Pressure",
  "Trade & Economy",
];

export type IndicatorKey =
  | "renewableWater"
  | "waterPerCapita"
  | "waterStress"
  | "totalWithdrawal"
  | "withdrawalPerCapita"
  | "virtualWaterBalance"
  | "gdpPerCapita"
  | "waterProductivity";

export interface IndicatorMeta {
  source: string;
  vintage: string;
  hasWorldRank: boolean;
}

export interface IndicatorCategory {
  key: string;
  label: string;
  color: string;
}

interface IndicatorBase {
  key: IndicatorKey;
  label: string;
  short: string; // compact label for tight UI (tooltip, legend, matrix)
  unit: string; // "" when not applicable
  group: IndicatorGroup;
  meta: IndicatorMeta;
  /** Numeric value for colouring / sorting. NaN for categorical indicators. */
  numericValue: (c: Country) => number;
  /** Display value (with unit for sequential; category label for categorical). */
  format: (c: Country) => string;
  /** World rank accessor when meta.hasWorldRank, else null. */
  rank: ((c: Country) => number) | null;
}

export interface SequentialIndicator extends IndicatorBase {
  scale: "sequential";
  direction: "higherBetter" | "higherWorse" | "neutral";
  ramp: readonly [string, string]; // low → high single-hue endpoints
  /** Format an arbitrary value (used for legend endpoints). */
  formatValue: (v: number) => string;
}

export interface CategoricalIndicator extends IndicatorBase {
  scale: "categorical";
  categories: readonly IndicatorCategory[];
  /** The category key for a country. */
  categoryKey: (c: Country) => string;
}

export type Indicator = SequentialIndicator | CategoricalIndicator;

// Water Stress — SDG 6.4.2 five-band classification (by withdrawal % of resources)
export function sdgBand(pct: number): string {
  if (pct < 25) return "no-stress";
  if (pct < 50) return "low";
  if (pct < 75) return "medium";
  if (pct < 100) return "high";
  return "critical";
}

const SDG_BANDS: readonly IndicatorCategory[] = [
  { key: "no-stress", label: "No stress · <25%", color: "#1F9E7A" },
  { key: "low", label: "Low · 25–50%", color: "#E0B43B" },
  { key: "medium", label: "Medium · 50–75%", color: "#E08A3C" },
  { key: "high", label: "High · 75–100%", color: "#D0563B" },
  { key: "critical", label: "Critical · >100%", color: "#A02B2B" },
];

/** Simplified Low/Medium/High legend for water stress (optional alternative to
 *  the 5 SDG bands). */
export const WATER_STRESS_TIER3: readonly IndicatorCategory[] = [
  { key: "low", label: "Low · <25%", color: "#1F9E7A" },
  { key: "medium", label: "Medium · 25–75%", color: "#E08A3C" },
  { key: "high", label: "High · ≥75%", color: "#A02B2B" },
];

export function waterStressTier3(): readonly IndicatorCategory[] {
  return WATER_STRESS_TIER3;
}

export function waterStressTier3Of(pct: number): string {
  if (pct < 25) return "low";
  if (pct < 75) return "medium";
  return "high";
}

const VWB_CATEGORIES: readonly IndicatorCategory[] = [
  { key: "Net exporter", label: "Net exporter", color: "#0F766E" },
  { key: "Net importer", label: "Net importer", color: "#B5742A" },
  { key: "Verify", label: "Verify", color: "#7A8896" },
];

const FAO: IndicatorMeta = {
  source: "FAO AQUASTAT",
  vintage: "2017–2020",
  hasWorldRank: false,
};

function seq(o: {
  key: IndicatorKey;
  label: string;
  short: string;
  unit: string;
  group: IndicatorGroup;
  direction: SequentialIndicator["direction"];
  ramp: readonly [string, string];
  meta: IndicatorMeta;
  numericValue: (c: Country) => number;
  formatValue: (v: number) => string;
  rank?: (c: Country) => number;
}): SequentialIndicator {
  return {
    scale: "sequential",
    key: o.key,
    label: o.label,
    short: o.short,
    unit: o.unit,
    group: o.group,
    direction: o.direction,
    ramp: o.ramp,
    meta: o.meta,
    numericValue: o.numericValue,
    formatValue: o.formatValue,
    format: (c) => o.formatValue(o.numericValue(c)),
    rank: o.rank ?? null,
  };
}

function cat(o: {
  key: IndicatorKey;
  label: string;
  short: string;
  unit?: string;
  group: IndicatorGroup;
  meta: IndicatorMeta;
  categories: readonly IndicatorCategory[];
  categoryKey: (c: Country) => string;
  format: (c: Country) => string;
  numericValue?: (c: Country) => number;
}): CategoricalIndicator {
  return {
    scale: "categorical",
    key: o.key,
    label: o.label,
    short: o.short,
    unit: o.unit ?? "",
    group: o.group,
    meta: o.meta,
    categories: o.categories,
    categoryKey: o.categoryKey,
    format: o.format,
    numericValue: o.numericValue ?? (() => NaN),
    rank: null,
  };
}

/** All indicators, in display order, grouped by `group`. */
export const INDICATORS: readonly Indicator[] = [
  // ── Resources ──
  seq({
    key: "renewableWater",
    label: "Renewable Water Resources",
    short: "Renewable water",
    unit: "km³/yr",
    group: "Resources",
    direction: "higherBetter",
    ramp: ["#E6F3F4", "#0F766E"],
    meta: { ...FAO, hasWorldRank: true },
    numericValue: (c) => c.renewableWater,
    formatValue: (v) => withUnit(v, v >= 100 ? 0 : 1, "km³/yr"),
    rank: (c) => c.renewableWaterRank,
  }),
  seq({
    key: "waterPerCapita",
    label: "Renewable Water per Capita",
    short: "Water per capita",
    unit: "m³/cap/yr",
    group: "Resources",
    direction: "higherBetter",
    ramp: ["#EAF2EC", "#2E7D32"],
    meta: { ...FAO, hasWorldRank: true },
    numericValue: (c) => c.waterPerCapita,
    formatValue: (v) => withUnit(v, 0, "m³/cap/yr"),
    rank: (c) => c.waterPerCapitaRank,
  }),
  // ── Pressure ──
  cat({
    key: "waterStress",
    label: "Water Stress",
    short: "Water stress",
    unit: "%",
    group: "Pressure",
    meta: { source: "FAO AQUASTAT · SDG 6.4.2", vintage: "2017–2020", hasWorldRank: false },
    categories: SDG_BANDS,
    categoryKey: (c) => sdgBand(c.waterStress),
    numericValue: (c) => c.waterStress,
    format: (c) => `${formatNumber(c.waterStress, 1)}%`,
  }),
  seq({
    key: "totalWithdrawal",
    label: "Total Freshwater Withdrawal",
    short: "Withdrawal",
    unit: "km³/yr",
    group: "Pressure",
    direction: "neutral",
    ramp: ["#FBEFE1", "#B45309"],
    meta: FAO,
    numericValue: (c) => c.totalWithdrawal,
    formatValue: (v) => withUnit(v, v >= 10 ? 1 : 2, "km³/yr"),
  }),
  seq({
    key: "withdrawalPerCapita",
    label: "Withdrawal per Capita",
    short: "Withdrawal/cap",
    unit: "m³/cap",
    group: "Pressure",
    direction: "neutral",
    ramp: ["#FBF1DD", "#B23A48"],
    meta: FAO,
    numericValue: (c) => c.withdrawalPerCapita,
    formatValue: (v) => withUnit(v, 0, "m³/cap"),
  }),
  // ── Trade & Economy ──
  cat({
    key: "virtualWaterBalance",
    label: "Virtual Water Balance",
    short: "Virtual water",
    group: "Trade & Economy",
    meta: {
      source: "Water Footprint Network",
      vintage: "1996–2005",
      hasWorldRank: false,
    },
    categories: VWB_CATEGORIES,
    categoryKey: (c) => c.virtualWaterBalance,
    format: (c) => c.virtualWaterBalance,
  }),
  seq({
    key: "gdpPerCapita",
    label: "GDP per Capita",
    short: "GDP/capita",
    unit: "USD",
    group: "Trade & Economy",
    direction: "higherBetter",
    ramp: ["#EAEFF7", "#1E40AF"],
    meta: { source: "World Bank · IMF", vintage: "2026 proj.", hasWorldRank: false },
    numericValue: (c) => c.gdpPerCapita,
    formatValue: (v) => withUnit(v, 0, "USD"),
  }),
  seq({
    key: "waterProductivity",
    label: "Water Productivity",
    short: "Productivity",
    unit: "USD/m³",
    group: "Trade & Economy",
    direction: "higherBetter",
    ramp: ["#ECEEF8", "#4338CA"],
    meta: { ...FAO, hasWorldRank: true },
    numericValue: (c) => c.waterProductivity,
    formatValue: (v) => withUnit(v, 2, "USD/m³"),
    rank: (c) => c.waterProductivityRank,
  }),
];

export const DEFAULT_INDICATOR: IndicatorKey = "renewableWater";

export function getIndicator(key: IndicatorKey): Indicator {
  return INDICATORS.find((i) => i.key === key) ?? INDICATORS[0];
}

export interface IndicatorGroupBlock {
  group: IndicatorGroup;
  indicators: Indicator[];
}

/** Indicators bucketed by group, in canonical order — for the layer switcher. */
export const GROUPED_INDICATORS: IndicatorGroupBlock[] = INDICATOR_GROUP_ORDER.map(
  (group) => ({ group, indicators: INDICATORS.filter((i) => i.group === group) }),
);

// ── Colour resolution ────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function lerpHex(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const ch = (i: number) =>
    Math.round(pa[i] + (pb[i] - pa[i]) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

const extentCache = new Map<IndicatorKey, [number, number]>();

/** Min/max of a sequential indicator across the 16 pilot countries. */
export function indicatorExtent(ind: SequentialIndicator): [number, number] {
  const cached = extentCache.get(ind.key);
  if (cached) return cached;
  const vals = COUNTRIES.map((c) => ind.numericValue(c));
  const e: [number, number] = [Math.min(...vals), Math.max(...vals)];
  extentCache.set(ind.key, e);
  return e;
}

/** Fill colour for a country under an indicator (sequential ramp or category). */
export function indicatorColor(ind: Indicator, c: Country): string {
  if (ind.scale === "categorical") {
    return indicatorCategory(ind, c).color;
  }
  const [min, max] = indicatorExtent(ind);
  const t = max > min ? (ind.numericValue(c) - min) / (max - min) : 0;
  return lerpHex(ind.ramp[0], ind.ramp[1], clamp01(t));
}

/** 0–1 position of a value within a domain (defaults to the pilot extent). */
export function indicatorFraction(
  ind: SequentialIndicator,
  c: Country,
  domain?: [number, number],
): number {
  const [min, max] = domain ?? indicatorExtent(ind);
  return max > min ? clamp01((ind.numericValue(c) - min) / (max - min)) : 0;
}

/** The resolved category (label + colour) for a categorical indicator. */
export function indicatorCategory(
  ind: CategoricalIndicator,
  c: Country,
): IndicatorCategory {
  const key = ind.categoryKey(c);
  return (
    ind.categories.find((cat) => cat.key === key) ?? {
      key,
      label: key,
      color: "#888888",
    }
  );
}

// ── Withdrawal split (for the modal stacked bar) ─────────────────────────────

export interface WithdrawalSector {
  key: string;
  label: string;
  color: string;
  value: (c: Country) => number; // percent of total withdrawal
}

export const WITHDRAWAL_SECTORS: readonly WithdrawalSector[] = [
  { key: "agriculture", label: "Agriculture", color: "#3F8F4F", value: (c) => c.withdrawalAgriculture },
  { key: "industry", label: "Industry", color: "#5B6B7B", value: (c) => c.withdrawalIndustry },
  { key: "services", label: "Services", color: "#2F6FB0", value: (c) => c.withdrawalServices },
];

// ── Footnotes ────────────────────────────────────────────────────────────────

/** Global data note shown in the chrome. */
export const DATA_NOTE =
  "Data vintages differ (water 2017–2020, GDP 2026 proj.); virtual water balance is directional, 1996–2005. Pilot dataset — illustrative.";

/** Distinct "Source (vintage)" lines for the given indicators (modal footnote). */
export function sourceLines(indicators: readonly Indicator[] = INDICATORS): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const i of indicators) {
    const line = `${i.meta.source} (${i.meta.vintage})`;
    if (!seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
  }
  return out;
}
