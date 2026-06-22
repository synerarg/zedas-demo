"use client";

import { useRef } from "react";
import { ensureGsap, useIsomorphicLayoutEffect, EASE_OUT } from "@/lib/motion";
import { Container, Eyebrow, Measure } from "./primitives";

// "By the Numbers" — figures reconciled against the live product per brief §5.1:
//   • "Core Variables" corrected 12 → 7   (matches the 7 real indicators in zedas-data.ts)
//   • "Assessment Dimensions" corrected 5 → 6 (matches the six-dimension methodology)
// Flagged here for stakeholder review. "4 Continents" / "16 Pilot Countries" kept as-is.
//
// The first entry is the headline figure (the pilot's scope); the rest read as a
// measured instrument panel beside it.
const FEATURED = { value: 16, suffix: "", label: "Pilot countries" };
const STATS = [
  { value: 4, suffix: "", label: "Continents" },
  { value: 100, suffix: "+", label: "Experts & institutions" },
  { value: 7, suffix: "", label: "Core variables" },
  { value: 6, suffix: "", label: "Assessment dimensions" },
  { value: 1, suffix: "", label: "Global methodology" },
];

export default function ByTheNumbers() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hidden tab → rAF is frozen; don't zero the figures (they'd stay 0).
      if (document.hidden) return;
      const nums = el.querySelectorAll<HTMLElement>("[data-count]");
      nums.forEach((node) => {
        const target = Number(node.dataset.count);
        const suffix = node.dataset.suffix ?? "";
        const counter = { v: 0 };
        node.textContent = `0${suffix}`; // pre-paint, so no flash of the final value
        gsap.to(counter, {
          v: target,
          duration: 1.4,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
          onUpdate: () => {
            node.textContent = `${Math.round(counter.v)}${suffix}`;
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="numbers-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Eyebrow>By the Numbers</Eyebrow>
        <h2
          id="numbers-title"
          className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          The pilot, at a glance
        </h2>

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-surface">
          <div
            aria-hidden
            className="zd-graticule pointer-events-none absolute inset-0 opacity-60"
          />
          <dl className="relative grid lg:grid-cols-[1fr_1.5fr]">
            {/* Headline figure */}
            <div className="flex flex-col justify-center border-b border-border p-8 sm:p-10 lg:border-b-0 lg:border-r">
              <Measure>Pilot scope</Measure>
              <dd
                className="tnum mt-3 text-[clamp(4.5rem,12vw,7rem)] font-bold leading-[0.9] tracking-[-0.03em] text-foreground"
                data-count={FEATURED.value}
                data-suffix={FEATURED.suffix}
              >
                {FEATURED.value}
                {FEATURED.suffix}
              </dd>
              <dt className="mt-3 text-base font-semibold text-foreground">
                {FEATURED.label}
              </dt>
              <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">
                across Latin America, Africa, and Asia — one standardized
                methodology.
              </p>
            </div>

            {/* Measured readout of the supporting figures */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 p-8 sm:grid-cols-3 sm:p-10">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1.5">
                  <dd
                    className="tnum text-4xl font-bold leading-none tracking-tight text-foreground sm:text-[2.75rem]"
                    data-count={s.value}
                    data-suffix={s.suffix}
                  >
                    {s.value}
                    {s.suffix}
                  </dd>
                  <dt className="text-[13px] leading-tight text-muted">
                    {s.label}
                  </dt>
                </div>
              ))}
            </div>
          </dl>
        </div>
      </Container>
    </section>
  );
}
