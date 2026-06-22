import Reveal from "./reveal";
import { Container, Eyebrow } from "./primitives";
import { COUNTRIES } from "@/lib/zedas-data";
import PilotMap from "./pilot-map";

const REGION_ORDER = ["Latin America", "Africa", "Asia"] as const;

export default function Pilot() {
  // Grounded in the live dataset (src/lib/zedas-data.ts) — the same 16 countries
  // the map colors, counted by region.
  const byRegion = REGION_ORDER.map((region) => ({
    region,
    count: COUNTRIES.filter((c) => c.region === region).length,
  }));

  return (
    <section
      id="pilot"
      aria-labelledby="pilot-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>The Pilot</Eyebrow>
          <h2
            id="pilot-title"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Sixteen countries, one standardized methodology
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            The pilot phase brings together National Focal Points, experts, and
            institutions from sixteen countries across Latin America, Africa,
            and Asia, developing the first standardized methodology for
            water-based economic planning.
          </p>
        </Reveal>

        <Reveal
          delay={0.05}
          className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface p-4 sm:p-6"
        >
          <PilotMap />

          {/* Region breakdown, kept as a compact legend under the map. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-sm">
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span className="font-medium text-foreground">
                16 pilot countries
              </span>
            </span>
            {byRegion.map(({ region, count }) => (
              <span key={region} className="text-muted">
                <span className="tnum font-semibold text-foreground">
                  {count}
                </span>{" "}
                {region}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
