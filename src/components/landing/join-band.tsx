import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./reveal";
import { Container, Measure } from "./primitives";
import ContourField from "./contour-field";

export default function JoinBand() {
  return (
    <section
      id="join"
      aria-labelledby="join-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 text-center shadow-[0_1px_0_0_var(--border)] sm:px-12 sm:py-20">
          <ContourField
            className="pointer-events-none absolute inset-0 h-full w-full text-accent opacity-[0.07] dark:opacity-[0.12]"
          />
          <div className="relative">
            <Measure>Join the network</Measure>
            <h2
              id="join-title"
              className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-[2.5rem] sm:leading-[1.1]"
            >
              Help shape water-based development
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
              ZEDAS grows through international collaboration. Researchers,
              governments, companies, universities, and development
              organizations are invited to join.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 text-[15px] font-semibold text-muted"
              >
                Join the Network
                <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                  Soon
                </span>
              </button>
              <Link
                href="/map"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                In the meantime, explore the Global Map
                <ArrowRight
                  className="size-4 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
