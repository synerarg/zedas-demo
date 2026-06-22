import { ArrowDown } from "lucide-react";
import Reveal from "./reveal";
import { Container, Eyebrow, Measure } from "./primitives";

// The four disciplines ZEDAS combines (verbatim from the brief). Shown as a
// measured rail, not prose, so the cross-disciplinary claim reads at a glance.
const DISCIPLINES = ["Hydrology", "Economics", "Industrial policy", "Geospatial intelligence"];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <Eyebrow>About ZEDAS</Eyebrow>
          <h2
            id="about-title"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            A new question for an era of water scarcity
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            ZEDAS — Water Availability and Water-Resilient Economic Zones — is an
            international initiative that combines four disciplines to identify
            territories suitable for sustainable, water-based production.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {DISCIPLINES.map((d) => (
              <li
                key={d}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] font-medium text-foreground"
              >
                {d}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* The reframing — the move at the heart of the project, shown as a shift
            from the old question to the ZEDAS one rather than buried in prose. */}
        <Reveal
          delay={0.05}
          className="lg:col-span-7 lg:pt-2"
        >
          <figure className="relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-[0_1px_0_0_var(--border)] sm:p-10">
            <Measure>The question, reframed</Measure>

            <p className="mt-5 text-pretty text-lg leading-snug text-muted line-through decoration-border-strong decoration-1">
              How can industries adapt to water scarcity?
            </p>

            <ArrowDown
              className="my-4 size-5 text-accent"
              aria-hidden
              strokeWidth={2}
            />

            <blockquote className="text-balance text-2xl font-semibold leading-snug tracking-[-0.01em] text-foreground sm:text-[1.9rem] sm:leading-[1.25]">
              Where should future industries be located according to water
              availability?
            </blockquote>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
