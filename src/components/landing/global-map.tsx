import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./reveal";
import { Container, Eyebrow, Measure } from "./primitives";

// Honest framing per brief §5.2: only the capabilities the live map actually
// ships today are stated as present; basins, aquifers, sub-national detail,
// recommendations, reports and GIS layers are clearly marked as roadmap.
const LIVE_TODAY = [
  "Classifies 16 pilot countries across 7 water & economic indicators",
  "Switch indicator layers and read each country's value on the map",
  "Open any country for its full profile and an indicator breakdown chart",
  "Build side-by-side comparisons across selected countries",
];

const ROADMAP = [
  "River-basin and aquifer layers",
  "Sub-national, territory-level granularity",
  "Industry-fit recommendations",
  "Downloadable reports and GIS data layers",
];

// The Zedas Score profiles, with the same categorical colors the map uses.
const SCORE_PROFILES = [
  { label: "High Availability – High Quality", token: "bg-score-hq" },
  { label: "High Availability – Quality Constrained", token: "bg-score-qc" },
  { label: "Low Availability – High Efficiency", token: "bg-score-eff" },
  { label: "High Risk – Restricted Use", token: "bg-score-risk" },
];

export default function GlobalMap() {
  return (
    <section
      id="map-preview"
      aria-labelledby="map-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>The Global Map</Eyebrow>
          <h2
            id="map-title"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            See where water favors production
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            The pilot map turns the methodology into something you can explore.
            It classifies each pilot country by its water profile — and it grows
            from here.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Measure>Available today</Measure>
            <ul className="mt-5 flex flex-col gap-3.5">
              {LIVE_TODAY.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden
                    strokeWidth={2}
                  />
                  <span className="text-[15px] leading-relaxed text-muted">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/map"
              className="group mt-9 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-semibold text-accent-foreground shadow-sm transition-[transform,background-color] duration-200 ease-[var(--ease-out-quart)] hover:bg-accent/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explore the Global Map
              <ArrowRight
                className="size-[18px] transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </Reveal>

          <Reveal
            delay={0.05}
            className="relative overflow-hidden rounded-2xl border border-border bg-surface p-7 sm:p-8"
          >
            <div
              aria-hidden
              className="zd-graticule pointer-events-none absolute inset-0 opacity-60"
            />
            <div className="relative">
              <Measure>Zedas Score classification</Measure>
              <ul className="mt-5 flex flex-col gap-3.5">
                {SCORE_PROFILES.map((p) => (
                  <li key={p.label} className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={`size-3.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10 ${p.token}`}
                    />
                    <span className="text-[15px] leading-snug text-foreground/90">
                      {p.label}
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="my-7 border-t border-border" />

              <div className="flex items-center justify-between gap-2">
                <Measure>On the roadmap</Measure>
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Planned
                </span>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {ROADMAP.map((item) => (
                  <li key={item} className="text-[15px] leading-snug text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
