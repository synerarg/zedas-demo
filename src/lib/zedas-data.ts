// src/lib/zedas-data.ts
// ZEDAS Project — pilot dataset.
// PLACEHOLDER / illustrative values only. Replace when CAA confirms the three
// indicators and the Zedas Score thresholds. Profiles are distributed across all
// four categories for demo purposes. Join to the map by ISO numeric code (isoN).

export const INDICATORS = {
  availability: { label: "Water Availability", unit: "m³/cap/yr", direction: "higherBetter", placeholder: true },
  stress:       { label: "Water Quality",      unit: "%",         direction: "higherWorse",  placeholder: true },
  efficiency:   { label: "Supply Resilience",  unit: "USD/m³",    direction: "higherBetter", placeholder: true },
} as const;

export type Profile =
  | "High Availability – High Quality"
  | "High Availability – Quality Constrained"
  | "Low Availability – High Efficiency"
  | "High Risk – Restricted Use";

export const PROFILE_COLOR: Record<Profile, string> = {
  "High Availability – High Quality": "#0F766E",
  "High Availability – Quality Constrained": "#D4A017",
  "Low Availability – High Efficiency": "#2F6FB0",
  "High Risk – Restricted Use": "#B23A48",
};

export const NO_DATA_COLOR = { light: "#D8DCE0", dark: "#2A2F36" } as const;

// Single-hue sequential gradient endpoints per indicator [low, high].
export const GRADIENT = {
  availability: ["#E6F3F4", "#0F766E"],
  efficiency:   ["#E8EEF6", "#1E40AF"],
  stress:       ["#FBF1DD", "#B23A48"],
} as const;

// Narrative gradient endpoints shown in the legend (low → high). Placeholder.
export const LEGEND_ENDPOINTS: Record<
  "availability" | "stress" | "efficiency",
  { low: string; high: string }
> = {
  availability: { low: "Scarce · 0", high: "Abundant · 100" },
  stress:       { low: "Stressed · 0", high: "Secure · 100" },
  efficiency:   { low: "Fragile · 0", high: "Resilient · 100" },
};

export interface Country {
  isoA3: string;
  isoN: number; // ISO 3166-1 numeric — join key for world-atlas topojson `id`
  name: string;
  availability: number; // m³/cap/yr (placeholder)
  stress: number;       // % (placeholder)
  efficiency: number;   // USD/m³ (placeholder)
  profile: Profile;
  focalPoint: string;
  affiliation: string;
  source: string;
}

export const COUNTRIES: Country[] = [
  { isoA3: "ARG", isoN: 32,  name: "Argentina",    availability: 19000, stress: 38, efficiency: 18, profile: "Low Availability – High Efficiency",        focalPoint: "Pilot steward",        affiliation: "—",       source: "Placeholder" },
  { isoA3: "BRA", isoN: 76,  name: "Brazil",       availability: 41000, stress: 12, efficiency: 9,  profile: "High Availability – High Quality",         focalPoint: "Pilot steward",       affiliation: "—",         source: "Placeholder" },
  { isoA3: "COL", isoN: 170, name: "Colombia",     availability: 45000, stress: 10, efficiency: 7,  profile: "High Availability – High Quality",         focalPoint: "Pilot steward", affiliation: "—",             source: "Placeholder" },
  { isoA3: "MEX", isoN: 484, name: "Mexico",       availability: 3400,  stress: 55, efficiency: 22, profile: "Low Availability – High Efficiency",        focalPoint: "Pilot steward",          affiliation: "—",                               source: "Placeholder" },
  { isoA3: "KEN", isoN: 404, name: "Kenya",        availability: 650,   stress: 72, efficiency: 5,  profile: "High Risk – Restricted Use",               focalPoint: "Pilot steward",            affiliation: "—",                  source: "Placeholder" },
  { isoA3: "ETH", isoN: 231, name: "Ethiopia",     availability: 1100,  stress: 68, efficiency: 4,  profile: "High Risk – Restricted Use",               focalPoint: "Pilot steward",           affiliation: "—",        source: "Placeholder" },
  { isoA3: "GHA", isoN: 288, name: "Ghana",        availability: 1900,  stress: 45, efficiency: 6,  profile: "High Availability – Quality Constrained",  focalPoint: "Pilot steward",     affiliation: "—",                           source: "Placeholder" },
  { isoA3: "ZAF", isoN: 710, name: "South Africa", availability: 900,   stress: 63, efficiency: 16, profile: "Low Availability – High Efficiency",        focalPoint: "Pilot steward",         affiliation: "—",     source: "Placeholder" },
  { isoA3: "TZA", isoN: 834, name: "Tanzania",     availability: 1600,  stress: 40, efficiency: 5,  profile: "High Availability – Quality Constrained",  focalPoint: "Pilot steward",       affiliation: "—", source: "Placeholder" },
  { isoA3: "UGA", isoN: 800, name: "Uganda",       availability: 1400,  stress: 22, efficiency: 4,  profile: "High Availability – High Quality",         focalPoint: "Pilot steward",            affiliation: "—",                               source: "Placeholder" },
  { isoA3: "BFA", isoN: 854, name: "Burkina Faso", availability: 750,   stress: 70, efficiency: 3,  profile: "High Risk – Restricted Use",               focalPoint: "Pilot steward",               affiliation: "—",      source: "Placeholder" },
  { isoA3: "MLI", isoN: 466, name: "Mali",         availability: 5200,  stress: 48, efficiency: 4,  profile: "High Availability – Quality Constrained",  focalPoint: "Pilot steward",               affiliation: "—",        source: "Placeholder" },
  { isoA3: "NGA", isoN: 566, name: "Nigeria",      availability: 1300,  stress: 66, efficiency: 8,  profile: "High Risk – Restricted Use",               focalPoint: "Pilot steward",                affiliation: "—",                          source: "Placeholder" },
  { isoA3: "IND", isoN: 356, name: "India",        availability: 1100,  stress: 67, efficiency: 12, profile: "Low Availability – High Efficiency",        focalPoint: "Pilot steward",         affiliation: "—",      source: "Placeholder" },
  { isoA3: "NPL", isoN: 524, name: "Nepal",        availability: 6500,  stress: 18, efficiency: 5,  profile: "High Availability – High Quality",         focalPoint: "Pilot steward",                  affiliation: "—",               source: "Placeholder" },
  { isoA3: "VNM", isoN: 704, name: "Vietnam",      availability: 8800,  stress: 35, efficiency: 7,  profile: "High Availability – Quality Constrained",  focalPoint: "Pilot steward",             affiliation: "—",      source: "Placeholder" },
];

export const COUNTRY_BY_ISON: Record<number, Country> = Object.fromEntries(
  COUNTRIES.map((c) => [c.isoN, c]),
);
