"use client";

import { useRef } from "react";
import { Container } from "./primitives";
import { ensureGsap, useIsomorphicLayoutEffect } from "@/lib/motion";

// The manifesto quote, written as segments so the key phrases can be bolded.
// Each segment is flattened to words; the words light up one by one as the
// section scrolls through, so the statement reads as if it's being written.
const SEGMENTS: { text: string; bold?: boolean }[] = [
  { text: "For more than two centuries, the geography of development was shaped by" },
  { text: "coal, oil, ports, labor, and capital.", bold: true },
  { text: "Today" },
  { text: "water", bold: true },
  { text: "is emerging as the" },
  { text: "defining strategic asset", bold: true },
  { text: "of the twenty-first century. The question is no longer how to bring water to production —" },
  { text: "production must adapt to water.", bold: true },
];

const WORDS = SEGMENTS.flatMap((seg) =>
  seg.text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ word, bold: seg.bold })),
);

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    // Scroll-scrubbed "writing": the section pins in place and each word fades
    // from faint to full as you keep scrolling, so the page stays put until the
    // whole quote has written itself out — then scrolling continues normally.
    // Content ships fully visible (CSS default); the faint "from" state is only
    // set when motion is permitted, so reduced-motion / headless renders are fine.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = el.querySelectorAll("[data-quote-word]");
      gsap.fromTo(
        words,
        { opacity: 0.12 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=130%",
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
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
      className="relative flex min-h-dvh scroll-mt-20 flex-col items-center justify-center overflow-hidden py-24"
    >
      {/* Dotted field — replaces the old solid deep-water band. Masked so the
          dots dissolve toward the edges instead of reading as a hard grid. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border-strong)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_50%,transparent_90%)]"
      />

      <Container className="relative">
        <blockquote
          id="manifesto-title"
          className="mx-auto max-w-4xl text-balance text-center text-[clamp(1.6rem,4vw,2.6rem)] font-medium leading-[1.3] tracking-[-0.015em] text-foreground"
        >
          {WORDS.map(({ word, bold }, i) => (
            <span
              key={i}
              data-quote-word
              className={bold ? "font-bold" : undefined}
            >
              {word}
              {i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </blockquote>
      </Container>
    </section>
  );
}
