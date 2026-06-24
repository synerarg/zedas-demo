import Reveal from "./reveal";
import { Container, Eyebrow, Measure } from "./primitives";

// The two institutions behind the grant (verbatim from the funding statement).
// Each mark is set on a white registration plate so it reads in either theme —
// the Danida wordmark is black-on-transparent, the Danish arms a red square.
const FUNDERS = [
  {
    src: "/logos/danida.png",
    name: "Danida Fellowship Centre",
    alt: "Danida Fellowship Centre logo",
  },
  {
    src: "/logos/denmark.png",
    name: "Ministry of Foreign Affairs of Denmark",
    alt: "Coat of arms of the Ministry of Foreign Affairs of Denmark",
  },
];

export default function Acknowledgement() {
  return (
    <section
      id="acknowledgement"
      aria-labelledby="acknowledgement-title"
      className="scroll-mt-20 border-t border-border py-20 sm:py-28 lg:py-32"
    >
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Acknowledgement</Eyebrow>
          <h2
            id="acknowledgement-title"
            className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Made possible by the Danida Fellows Networkers Grant 2026
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              The pilot phase of the ZEDAS Project has been made possible through
              the support of the Danida Fellows Networkers Grant 2026.
            </p>
            <p>
              The grant has been provided by Danida Fellowship Centre and the
              Ministry of Foreign Affairs of Denmark.
            </p>
          </div>
        </Reveal>

        {/* Funder credit plate — two registration tiles joined by a hairline
            (gap-px over a border-coloured base), each mark white-backed and
            captioned with a measured index, in the page's instrument language. */}
        <Reveal delay={0.05} className="mt-12">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {FUNDERS.map((f, i) => (
              <li
                key={f.name}
                className="flex flex-col items-center gap-6 bg-surface p-8 text-center sm:p-10"
              >
                <div className="flex h-28 w-full items-center justify-center rounded-xl bg-white p-5 ring-1 ring-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- small static logo asset */}
                  <img
                    src={f.src}
                    alt={f.alt}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto object-contain"
                  />
                </div>
                <div>
                  <Measure>
                    {`Funding partner — ${String(i + 1).padStart(2, "0")} / ${String(
                      FUNDERS.length,
                    ).padStart(2, "0")}`}
                  </Measure>
                  <p className="mt-1.5 text-[15px] font-semibold text-foreground">
                    {f.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
