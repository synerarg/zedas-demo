import { Droplets, LineChart, Sprout, Globe } from "lucide-react";
import Reveal from "./reveal";
import { Container, Eyebrow } from "./primitives";

const REASONS = [
  {
    icon: Droplets,
    title: "Water first",
    body: "Water becomes the primary variable for industrial location decisions — not an afterthought to manage.",
  },
  {
    icon: LineChart,
    title: "Smarter investment",
    body: "Governments and investors can identify resilient opportunities before committing capital.",
  },
  {
    icon: Sprout,
    title: "Sustainable production",
    body: "Economic growth and freshwater protection stop competing and start reinforcing each other.",
  },
  {
    icon: Globe,
    title: "Global cooperation",
    body: "A common language for water-based development, shared across borders and institutions.",
  },
];

export default function WhyZedas() {
  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <Eyebrow>Why ZEDAS</Eyebrow>
          <h2
            id="why-title"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Four shifts behind a water-first approach
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            Putting water at the center of where production happens changes the
            calculus for everyone with a stake in it.
          </p>
        </Reveal>

        {/* Columns headed by a rule — a chart-column device, not rounded cards.
            The rule warms to the accent on hover for a quiet micro-interaction. */}
        <Reveal
          stagger={0.07}
          className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {REASONS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group border-t-2 border-border-strong pt-6 transition-colors duration-300 hover:border-accent/70"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent ring-1 ring-inset ring-accent/15 transition-colors duration-200 group-hover:bg-accent/15">
                <Icon className="size-5" aria-hidden strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {body}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
