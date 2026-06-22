"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { ensureGsap, useIsomorphicLayoutEffect, EASE_OUT } from "@/lib/motion";
import ContourField from "./contour-field";
import { Measure } from "./primitives";

// The four Zedas Score profiles, shown in the hero as a compact "key" so the
// page opens on the product's actual output — not an abstract slogan. Colours
// are the map's categorical tokens (the brand's one bold move).
const SCORE_KEY = [
  { token: "bg-score-hq", label: "High availability" },
  { token: "bg-score-qc", label: "Quality constrained" },
  { token: "bg-score-eff", label: "High efficiency" },
  { token: "bg-score-risk", label: "Restricted use" },
];

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

      // Signature: the bathymetric contour field draws itself on, like a survey
      // chart being plotted. Measure each isoline and run its stroke in.
      const paths = el.querySelectorAll<SVGPathElement>("[data-contour] path");
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.6,
        stagger: 0.04,
        ease: "power2.out",
      })
        .from(
          el.querySelectorAll("[data-hero-item]"),
          { opacity: 0, y: 26, duration: 0.8, stagger: 0.08 },
          0.25,
        )
        .from("[data-hero-cue]", { opacity: 0, duration: 0.6 }, "-=0.2");
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden px-4 pb-24 pt-32 sm:px-6 lg:px-8"
    >
      {/* Instrument backdrop: faint coordinate graticule + the contour signature,
          seated by a soft white vignette so the type stays the focus. */}
      <div
        aria-hidden
        className="zd-graticule pointer-events-none absolute inset-0 -z-20 opacity-70"
      />
      <ContourField
        drift
        className="zd-contour-draw pointer-events-none absolute inset-0 -z-10 h-full w-full text-accent opacity-[0.16] dark:opacity-[0.2]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(115%_85%_at_50%_42%,transparent_30%,var(--background)_88%)]"
      />

      {/* Survey coordinate ticks — instrument vernacular, decorative. */}
      <Measure className="pointer-events-none absolute left-5 top-24 hidden lg:block">
        34°36′S · 58°22′W
      </Measure>
      <Measure className="pointer-events-none absolute right-5 top-24 hidden lg:block">
        EQUAL EARTH
      </Measure>

      <div className="mx-auto w-full max-w-3xl text-center">
        <p
          data-hero-item
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
        >
          <span className="text-sm font-bold tracking-tight text-foreground">
            ZEDAS Project
          </span>
          <span aria-hidden className="hidden h-3 w-px bg-border-strong sm:block" />
          <span className="zd-meas text-[11px] uppercase text-muted">
            Global water-intelligence platform · Pilot
          </span>
        </p>

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
          As climate change, population growth, and industrial expansion strain
          freshwater, ZEDAS identifies the territories where water availability,
          quality, resilience, and governance can sustain long-term economic
          development.
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

        {/* The through-line — the brand's emotional spine, with a drawn accent. */}
        <p
          data-hero-item
          className="mx-auto mt-14 text-[clamp(1.4rem,4vw,2.25rem)] font-semibold tracking-[-0.02em] text-foreground"
        >
          Production follows{" "}
          <span className="text-accent underline decoration-accent/30 decoration-[3px] underline-offset-[6px]">
            water
          </span>
          .
        </p>

        {/* Product key: the Zedas Score, shown up front. */}
        <div
          data-hero-item
          className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          <span className="zd-meas text-[10px] uppercase text-muted">
            Zedas Score
          </span>
          {SCORE_KEY.map(({ token, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className={`size-2.5 rounded-full ring-1 ring-inset ring-black/10 ${token}`}
              />
              <span className="text-xs text-muted">{label}</span>
            </span>
          ))}
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
