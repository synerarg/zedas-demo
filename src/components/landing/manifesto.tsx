"use client";

import { useRef } from "react";
import Reveal from "./reveal";
import { Container } from "./primitives";
import ContourField from "./contour-field";
import { ensureGsap, useIsomorphicLayoutEffect } from "@/lib/motion";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const contour = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    const layer = contour.current;
    if (!el || !layer) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    // Depth parallax: the contour field drifts slower than the page as the band
    // scrolls through, so the quote feels seated over deeper water.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        layer,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="manifesto-title"
      className="relative scroll-mt-20 overflow-hidden border-y border-deep-border bg-deep py-24 text-deep-foreground sm:py-32 lg:py-40"
    >
      <div ref={contour} className="pointer-events-none absolute inset-0 -inset-y-12">
        <ContourField className="h-full w-full text-deep-accent opacity-[0.16]" />
      </div>
      <div aria-hidden className="zd-deep-glow pointer-events-none absolute inset-0" />

      <Container className="relative">
        <Reveal className="mx-auto max-w-3xl">
          <p className="flex items-center gap-2.5">
            <span aria-hidden className="h-px w-7 shrink-0 bg-deep-accent/70" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-deep-accent">
              The Water Century
            </span>
          </p>

          <figure className="mt-6">
            <blockquote
              id="manifesto-title"
              className="text-balance text-2xl font-medium leading-snug tracking-[-0.01em] sm:text-[2.1rem] sm:leading-[1.28]"
            >
              For more than two centuries, the geography of development was
              shaped by coal, oil, ports, labor, and capital. Today water is
              emerging as the defining strategic asset of the twenty-first
              century. The question is no longer how to bring water to
              production — production must adapt to water.
            </blockquote>
            <figcaption className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="text-[clamp(1.25rem,3vw,1.85rem)] font-semibold tracking-[-0.01em] text-deep-accent">
                Production follows water.
              </span>
              <span
                aria-disabled="true"
                className="inline-flex items-center gap-2 text-sm font-medium text-deep-muted"
              >
                Read the full manifesto
                <span className="rounded-full border border-deep-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Soon
                </span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
