"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowRight, Send, Loader2, Check, Database } from "lucide-react";
import Reveal from "./reveal";
import { Container } from "./primitives";
import ContourField from "./contour-field";

// The project's furthest-reaching ambition (per the Head of Product): an AI
// agent that, on top of the data ZEDAS keeps loading, can be asked in plain
// language to simulate how global value chains shift with water availability —
// and to take actions over the data. This section dramatizes that as a looping
// chat demo, and is honestly flagged as a not-yet-live preview.

const PROMPT =
  "If water availability drops 20% in northern Argentina, where should textile manufacturing relocate?";

// The value chain the agent re-evaluates; one node is the simulated move.
const CHAIN = [
  { node: "Inputs", moved: false },
  { node: "Processing", moved: false },
  { node: "Manufacturing", moved: true },
  { node: "Export", moved: false },
];

const CAPABILITIES = [
  "Ask in plain language — the agent reads the data and runs the simulation for you.",
  "Every answer is grounded in the same six-dimension assessment behind ZEDAS.",
  "Take action: save scenarios, adjust variables, and update the panel in place.",
];

type Action = "idle" | "running" | "done";

// Discrete phases of the looping conversation. Initial state is the FINAL frame
// so SSR, reduced-motion, and pre-hydration renders show the full exchange; the
// animation (only when in view + motion allowed) resets and replays from empty.
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
            and it will simulate how global value chains shift with water
            availability and the other variables that decide where production can
            sustainably happen, acting on the data as it goes.
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
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const set = (patch: Partial<Frame>) => setFrame((f) => ({ ...f, ...patch }));

    async function play() {
      if (running) return;
      running = true;
      while (!cancelled) {
        setFrame(EMPTY);
        await sleep(800); if (cancelled) break;

        // Typewriter the prompt into the input.
        for (let i = 1; i <= PROMPT.length; i++) {
          set({ typed: PROMPT.slice(0, i) });
          await sleep(26); if (cancelled) break;
        }
        if (cancelled) break;
        await sleep(550); if (cancelled) break;

        // Send.
        set({ sent: true, typed: "" });
        await sleep(650); if (cancelled) break;

        // Agent thinks, then runs the simulation, then resolves it.
        set({ thinking: true });
        await sleep(1050); if (cancelled) break;
        set({ thinking: false, action: "running" });
        await sleep(1700); if (cancelled) break;
        set({ action: "done" });
        await sleep(950); if (cancelled) break;
        set({ answered: true });

        // Hold the completed exchange, then loop.
        await sleep(5200); if (cancelled) break;
      }
      running = false;
    }

    // Only animate while the demo is on screen; restart cleanly each time.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cancelled = false;
          play();
        } else {
          cancelled = true;
        }
      },
      { threshold: 0.35 },
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
        A demonstration of asking the ZEDAS Intelligence agent where textile
        manufacturing should relocate if water availability drops 20% in northern
        Argentina. The agent runs a value-chain simulation and recommends moving
        manufacturing to a water-resilient zone. Illustrative preview.
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
        <div className="flex h-[21rem] flex-col justify-end gap-3 overflow-hidden px-4 py-4 sm:h-[22rem] sm:px-5">
          {/* User message */}
          {frame.sent && (
            <div className="zd-rise flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-deep-accent/15 px-3.5 py-2.5 text-[13px] leading-relaxed text-deep-foreground ring-1 ring-inset ring-deep-accent/20">
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

          {/* Agent: action card (the simulation it runs over the data) */}
          {frame.action !== "idle" && (
            <div className="zd-rise rounded-xl border border-deep-border bg-deep/50 p-3.5">
              <div className="flex items-center gap-2">
                {frame.action === "running" ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin text-deep-accent" />
                    <span className="zd-meas text-[10px] uppercase tracking-[0.14em] text-deep-foreground/80">
                      Running simulation
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex size-4 items-center justify-center rounded-full bg-deep-accent/20 text-deep-accent">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="zd-meas text-[10px] uppercase tracking-[0.14em] text-deep-accent">
                      Simulation complete
                    </span>
                  </>
                )}
              </div>

              {frame.action === "done" && (
                <div className="zd-rise mt-3">
                  <ol className="flex items-stretch gap-1.5">
                    {CHAIN.map((c, i) => (
                      <li key={c.node} className="flex flex-1 items-center gap-1.5">
                        <div
                          className={`flex-1 rounded-md border px-1.5 py-1.5 text-center text-[10.5px] font-medium leading-tight ${
                            c.moved
                              ? "border-deep-accent/50 bg-deep-accent/10 text-deep-foreground"
                              : "border-deep-border bg-deep/40 text-deep-foreground/70"
                          }`}
                        >
                          {c.node}
                          {c.moved && (
                            <span className="zd-meas mt-0.5 block text-[8px] uppercase tracking-[0.1em] text-deep-accent">
                              Moved
                            </span>
                          )}
                        </div>
                        {i < CHAIN.length - 1 && (
                          <ArrowRight className="size-3 shrink-0 text-deep-muted" />
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Metric label="Drought exposure" value="↓ 38%" />
                    <Metric label="Export reach" value="preserved" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agent: natural-language answer + an action it offers to take */}
          {frame.answered && (
            <div className="zd-rise">
              <p className="max-w-[92%] rounded-2xl rounded-bl-sm bg-deep/60 px-3.5 py-2.5 text-[13px] leading-relaxed text-deep-foreground/90 ring-1 ring-inset ring-deep-border">
                Manufacturing carries the highest water exposure. Moving it to a
                high-availability, high-quality zone cuts drought risk while
                keeping export reach.
              </p>
              <div className="mt-2 flex items-center gap-2 pl-1">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-deep-accent/30 bg-deep-accent/10 px-2.5 py-1 text-[11px] font-medium text-deep-accent">
                  <Database className="size-3" />
                  Save scenario to panel
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
                <span className="text-deep-muted">Ask the agent to simulate a scenario…</span>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-md border border-deep-border bg-deep/40 px-2 py-1">
      <span className="text-[10.5px] text-deep-muted">{label}</span>
      <span className="zd-meas text-[11px] font-semibold text-deep-accent">{value}</span>
    </span>
  );
}
