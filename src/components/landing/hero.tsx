"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ensureGsap, useIsomorphicLayoutEffect, EASE_OUT } from "@/lib/motion";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { Eyebrow } from "./primitives";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // If the tab is hidden, requestAnimationFrame never ticks and GSAP would
      // freeze the entrance at opacity 0 — leaving the hero blank. Skip the
      // hide-then-reveal so content stays at its visible CSS default.
      if (document.hidden) return;

      // Entrance: the centred content rises and fades in, then the scroll cue.
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.from(el.querySelectorAll("[data-hero-item]"), {
        opacity: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.08,
      }).from("[data-hero-cue]", { opacity: 0, duration: 0.6 }, "-=0.2");
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden px-4 pb-24 pt-32 sm:px-6 lg:px-8"
    >
      {/* Instrument backdrop: a fine diagonal hatch (Magic UI striped pattern),
          seated by a soft vignette so the type stays the focus. The vignette
          sits above the hatch so the stripes dissolve toward the edges instead
          of reading as a hard fill. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <StripedPattern
          width={14}
          height={14}
          className="text-accent opacity-[0.14] dark:opacity-[0.18]"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(115%_85%_at_50%_42%,transparent_30%,var(--background)_88%)]"
      />

      <div className="mx-auto w-full max-w-3xl text-center">
        <div data-hero-item className="flex justify-center">
          <Eyebrow>Global water-intelligence platform · Pilot</Eyebrow>
        </div>

        <h1
          id="hero-title"
          data-hero-item
          className="mt-6 text-balance text-[clamp(2.5rem,7vw,4.75rem)] font-bold leading-[1.04] tracking-[-0.025em] text-foreground"
        >
          Mapping the future of{" "}
          <span className="text-accent">water-based production</span>
        </h1>

        <p
          data-hero-item
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-[17px]"
        >
          ZEDAs Project is building the world's first global platform to identify territories where water availability, quality, resilience, and governance can support long-term economic development.
        </p>

        <div
          data-hero-item
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/map"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-semibold text-accent-foreground shadow-sm transition-[transform,background-color] duration-200 ease-[var(--ease-out-quart)] hover:bg-accent/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
          >
            Explore the Global Map
            <ArrowRight
              className="size-[18px] transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <a
            href="#about"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface/70 px-6 text-[15px] font-semibold text-foreground backdrop-blur-sm transition-colors duration-200 hover:bg-surface-2 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
          >
            How it works
          </a>
        </div>
      </div>

      <a
        href="#about"
        data-hero-cue
        aria-label="Scroll to learn more"
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center justify-center rounded-full p-2 text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ChevronDown className="size-5 motion-safe:animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
