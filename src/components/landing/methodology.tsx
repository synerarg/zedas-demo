"use client";

import { useRef } from "react";
import Reveal from "./reveal";
import { Container, Eyebrow, FuturePageLink } from "./primitives";
import { ensureGsap, useIsomorphicLayoutEffect } from "@/lib/motion";

// Six assessment dimensions (verbatim names from the brief), each with a short,
// accurate gloss. Numbered because this is a real, ordered framework — and laid
// out as a descending depth gauge: assessment as sounding the water column.
const DIMENSIONS = [
  {
    name: "Water Availability",
    gloss:
      "Renewable resources and per-capita supply that set the ceiling for new demand.",
  },
  {
    name: "Supply Capacity & Resilience",
    gloss: "Storage, variability, and the ability to absorb drought and shocks.",
  },
  {
    name: "Water Quality",
    gloss: "Whether available water meets the standards a given industry needs.",
  },
  {
    name: "Treatment, Reuse & Efficiency",
    gloss: "How far each cubic metre is stretched through reuse and productivity.",
  },
  {
    name: "Water–Industry Compatibility",
    gloss: "Matching sectoral water intensity to what a territory can sustain.",
  },
  {
    name: "Legislation",
    gloss: "The governance, rights, and rules that direct allocation and use.",
  },
];

export default function Methodology() {
  const root = useRef<HTMLElement>(null);
  const rule = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    const line = rule.current;
    if (!el || !line) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    // The sounding line draws down the gauge as the list scrolls into view.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 75%",
            scrub: 0.5,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="methodology"
      aria-labelledby="methodology-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>Methodology</Eyebrow>
          <h2
            id="methodology-title"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Six dimensions, scored consistently
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Every territory is sounded across the same six dimensions, so results
            are comparable from one country to the next.
          </p>
        </Reveal>

        <ol className="relative mt-12 max-w-3xl">
          {/* Depth gauge: a static track with the accent sounding line drawn over
              it on scroll. Both centre on the node column (left-2.5). */}
          <span
            aria-hidden
            className="absolute bottom-3 left-2.5 top-3 w-px -translate-x-1/2 bg-border"
          />
          <span
            ref={rule}
            aria-hidden
            className="zd-depth-rule absolute bottom-3 left-2.5 top-3 w-px -translate-x-1/2 bg-accent"
          />

          {DIMENSIONS.map((d, i) => (
            <li
              key={d.name}
              className="relative border-b border-border py-6 pl-10 last:border-b-0 sm:py-7"
            >
              <span
                aria-hidden
                className="absolute left-2.5 top-7 size-3 -translate-x-1/2 rounded-full bg-background ring-2 ring-accent sm:top-8"
              />
              <div className="flex items-baseline gap-3">
                <span className="zd-meas text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {d.name}
                </h3>
              </div>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">
                {d.gloss}
              </p>
            </li>
          ))}
        </ol>

        <Reveal className="mt-8">
          <FuturePageLink>Explore the full methodology</FuturePageLink>
        </Reveal>
      </Container>
    </section>
  );
}
