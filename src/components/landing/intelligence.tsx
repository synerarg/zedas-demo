"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight, Send, Loader2, Check, Layers } from "lucide-react";
import Reveal from "./reveal";
import { Container } from "./primitives";
import ContourField from "./contour-field";
import Flag from "@/components/flag";

// The project's furthest-reaching ambition (per the Head of Product): an AI
// agent that, on top of the data ZEDAS keeps loading, can be asked in plain
// language to reason over the indicators and act on the panel. This section
// dramatizes that as a looping chat demo and is flagged as a not-yet-live
// preview. Crucially, the demo speaks the panel's OWN language: every figure
// below is the real pilot value from src/lib/zedas-data.ts, shown with the same
// indicators (Renewable Water, Water Stress / SDG 6.4.2) and sources the map uses.

const PROMPT =
  "For water-intensive production, which pilot countries pair the most renewable water with no water stress?";

// Result rows — the correct top 3 (by renewable water, among the "No stress"
// SDG band) across the 16 pilot countries. Values verbatim from zedas-data.ts,
// formatted as the panel formats them. Do not edit without re-checking the data.
const MATCHES = [
  { isoN: 76, name: "Brazil", renewable: "8,647 km³/yr", stress: "1.5%" },
  { isoN: 170, name: "Colombia", renewable: "2,360 km³/yr", stress: "4.4%" },
  { isoN: 704, name: "Vietnam", renewable: "884 km³/yr", stress: "18.1%" },
];
// SDG 6.4.2 "No stress" band colour (zedas-data.ts → SDG_BANDS).
const NO_STRESS = "#1F9E7A";

const CAPABILITIES = [
  "Ask in plain language — the agent reads the live indicators and does the analysis for you.",
  "Grounded in the map's own pilot dataset: 16 countries, FAO AQUASTAT and SDG 6.4.2.",
  "Acts on the panel — switches indicator layers, compares countries, surfaces candidates.",
];

type Action = "idle" | "running" | "done";

// Discrete phases of the looping conversation. Initial state is the FINAL frame
// so SSR, reduced-motion, and pre-hydration renders show the full exchange; the
// animation (only when motion is allowed) resets and replays from empty.
interface Frame {
  typed: string;
  sent: boolean;
  thinking: boolean;
  action: Action;
  answered: boolean;
}
const FINAL: Frame = { typed: "", sent: true, thinking: false, action: "done", answered: true };
const EMPTY: Frame = { typed: "", sent: false, thinking: false, action: "idle", answered: false };

export default function Intelligence() {
  return (
    <section
      id="intelligence"
      aria-labelledby="intelligence-title"
      className="relative scroll-mt-20 overflow-hidden bg-deep py-20 text-deep-foreground sm:py-28 lg:py-32"
    >
      {/* Deep-water backdrop: soft accent glow + a faint contour field, the same
          bathymetric device the hero uses, tinted for the inverted band. */}
      <div aria-hidden className="zd-deep-glow pointer-events-none absolute inset-0" />
      <ContourField className="pointer-events-none absolute inset-0 h-full w-full text-deep-accent opacity-[0.06]" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* ── Statement ─────────────────────────────────────────────────────── */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="zd-meas inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-deep-accent">
              <Sparkles className="size-3.5" aria-hidden />
              ZEDAS Intelligence
            </span>
            <span className="zd-meas inline-flex items-center gap-1.5 rounded-full border border-deep-accent/30 bg-deep-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-deep-accent">
              <span aria-hidden className="size-1.5 rounded-full bg-deep-accent" />
              Coming soon
            </span>
          </div>

          <h2
            id="intelligence-title"
            className="mt-5 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-deep-foreground sm:text-4xl lg:text-[2.75rem]"
          >
            An AI agent you can ask to reshape value chains around water
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-deep-muted">
            The project&rsquo;s furthest ambition: as data accumulates across
            territories, you&rsquo;ll simply ask ZEDAS Intelligence a question —
            and it will reason over the same live indicators behind the map
            (water availability, stress, productivity) to show how and where
            global value chains can shift toward water-resilient ground.
          </p>

          <ul className="mt-8 space-y-3.5">
            {CAPABILITIES.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[15px] leading-relaxed text-deep-foreground/90">
                <ArrowRight className="mt-1 size-4 shrink-0 text-deep-accent" aria-hidden />
                <span>{c}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-deep-border bg-deep-2 px-5 text-[15px] font-semibold text-deep-muted"
            >
              Try the agent
              <span className="rounded-full border border-deep-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-deep-accent">
                Soon
              </span>
            </button>
          </div>
        </Reveal>

        {/* ── Animated chat demo ────────────────────────────────────────────── */}
        <Reveal delay={0.08}>
          <ChatDemo />
        </Reveal>
      </Container>
    </section>
  );
}

function ChatDemo() {
  const ref = useRef<HTMLElement>(null);
  const [frame, setFrame] = useState<Frame>(FINAL);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setFrame(FINAL);
      return;
    }

    let cancelled = false;
    let running = false;
    let visible = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const set = (patch: Partial<Frame>) => setFrame((f) => ({ ...f, ...patch }));

    async function play() {
      if (running) return;
      running = true;
      while (!cancelled) {
        // Pause at the top of the loop while the demo is scrolled out of view.
        while (!visible && !cancelled) await sleep(250);
        if (cancelled) break;

        setFrame(EMPTY);
        await sleep(800); if (cancelled) break;

        // Typewriter the prompt into the input.
        for (let i = 1; i <= PROMPT.length; i++) {
          set({ typed: PROMPT.slice(0, i) });
          await sleep(24); if (cancelled) break;
        }
        if (cancelled) break;
        await sleep(550); if (cancelled) break;

        // Send.
        set({ sent: true, typed: "" });
        await sleep(650); if (cancelled) break;

        // Agent thinks, then queries the dataset, then resolves the result.
        set({ thinking: true });
        await sleep(1050); if (cancelled) break;
        set({ thinking: false, action: "running" });
        await sleep(1700); if (cancelled) break;
        set({ action: "done" });
        await sleep(950); if (cancelled) break;
        set({ answered: true });

        // Hold the completed exchange, then loop.
        await sleep(5600); if (cancelled) break;
      }
      running = false;
    }

    // Start immediately; the observer only pauses/resumes the loop as the demo
    // enters and leaves the viewport (so it doesn't run unseen, but never
    // depends on the observer firing in order to start).
    play();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.25 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  const composing = frame.typed.length > 0 && !frame.sent;

  return (
    <figure
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-deep-border bg-deep-2/80 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm"
    >
      {/* Accessible static summary; the animated transcript below is decorative. */}
      <p className="sr-only">
        A demonstration of asking the ZEDAS Intelligence agent which pilot
        countries pair the most renewable water with no water stress. The agent
        queries the pilot dataset and returns Brazil, Colombia, and Vietnam with
        their renewable-water and water-stress values from FAO AQUASTAT and SDG
        6.4.2. Illustrative preview of a feature that is not yet live.
      </p>

      <div aria-hidden>
        {/* Window header */}
        <div className="flex items-center justify-between gap-3 border-b border-deep-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-md bg-deep-accent/15 text-deep-accent ring-1 ring-inset ring-deep-accent/25">
              <Sparkles className="size-3.5" />
            </span>
            <span className="zd-meas text-[11px] uppercase tracking-[0.14em] text-deep-foreground/80">
              ZEDAS Intelligence
            </span>
          </div>
          <span className="zd-meas text-[10px] uppercase tracking-[0.14em] text-deep-muted">
            v0.1 · preview
          </span>
        </div>

        {/* Transcript */}
        <div className="flex h-[22rem] flex-col justify-end gap-3 overflow-hidden px-4 py-4 sm:h-[23rem] sm:px-5">
          {/* User message */}
          {frame.sent && (
            <div className="zd-rise flex justify-end">
              <p className="max-w-[88%] rounded-2xl rounded-br-sm bg-deep-accent/15 px-3.5 py-2.5 text-[13px] leading-relaxed text-deep-foreground ring-1 ring-inset ring-deep-accent/20">
                {PROMPT}
              </p>
            </div>
          )}

          {/* Agent: typing indicator */}
          {frame.thinking && (
            <div className="zd-rise flex items-center gap-1.5 pl-1">
              <Dot delay="0ms" />
              <Dot delay="150ms" />
              <Dot delay="300ms" />
            </div>
          )}

          {/* Agent: action card — the query it runs over the pilot dataset */}
          {frame.action !== "idle" && (
            <div className="zd-rise rounded-xl border border-deep-border bg-deep/50 p-3.5">
              <div className="flex items-center gap-2">
                {frame.action === "running" ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-deep-accent" />
                    <span className="zd-meas text-[10px] uppercase tracking-[0.14em] text-deep-foreground/80">
                      Querying pilot dataset
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex size-4 items-center justify-center rounded-full bg-deep-accent/20 text-deep-accent">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="zd-meas text-[10px] uppercase tracking-[0.14em] text-deep-accent">
                      3 of 16 — No&nbsp;stress, ranked by renewable water
                    </span>
                  </>
                )}
              </div>

              {frame.action === "done" && (
                <div className="zd-rise mt-3">
                  <ul className="space-y-1.5">
                    {MATCHES.map((m) => (
                      <li
                        key={m.isoN}
                        className="flex items-center gap-2.5 rounded-lg border border-deep-border bg-deep/40 px-2.5 py-2"
                      >
                        <Flag isoN={m.isoN} className="h-3 w-auto rounded-[2px]" />
                        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-deep-foreground">
                          {m.name}
                        </span>
                        <span className="zd-meas tnum text-[11px] text-deep-foreground/75">
                          {m.renewable}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-deep-border px-1.5 py-0.5">
                          <span
                            aria-hidden
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: NO_STRESS }}
                          />
                          <span className="zd-meas tnum text-[10px] text-deep-foreground/70">
                            {m.stress}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="zd-meas mt-2.5 text-[9.5px] uppercase tracking-[0.12em] text-deep-muted/80">
                    Source · FAO AQUASTAT · SDG 6.4.2 · pilot dataset
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Agent: natural-language answer + a real panel action it offers */}
          {frame.answered && (
            <div className="zd-rise">
              <p className="max-w-[94%] rounded-2xl rounded-bl-sm bg-deep/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-deep-foreground/90 ring-1 ring-inset ring-deep-border">
                Brazil leads by a wide margin — 8,647&nbsp;km³/yr at just 1.5%
                stress. Colombia and Vietnam follow, both still in the No-stress
                band — strong ground for water-intensive production.
              </p>
              <div className="mt-2 flex items-center gap-2 pl-1">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-deep-accent/30 bg-deep-accent/10 px-2.5 py-1 text-[11px] font-medium text-deep-accent">
                  <Layers className="size-3" />
                  Set map layer · Water Stress
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-deep-border p-3 sm:p-3.5">
          <div className="flex items-center gap-2 rounded-xl border border-deep-border bg-deep/50 px-3.5 py-2.5">
            <span className="min-w-0 flex-1 truncate text-[13px] text-deep-foreground">
              {composing ? (
                <>
                  {frame.typed}
                  <span className="zd-caret ml-px inline-block h-3.5 w-px translate-y-0.5 bg-deep-accent align-middle" />
                </>
              ) : (
                <span className="text-deep-muted">Ask about the pilot countries and indicators…</span>
              )}
            </span>
            <span
              className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                composing ? "bg-deep-accent text-deep" : "bg-deep-border text-deep-muted"
              }`}
            >
              <Send className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-deep-muted"
      style={{ animationDelay: delay, animationDuration: "1s" }}
    />
  );
}
