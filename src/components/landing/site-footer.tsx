import Link from "next/link";
import { Container, FuturePageLink } from "./primitives";

const FUTURE_PAGES = [
  "About ZEDAS",
  "The Water Century",
  "Methodology",
  "Pilot Countries",
  "Focal Points",
  "Partners",
  "Knowledge Hub",
  "Contact",
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div
        aria-hidden
        className="zd-graticule pointer-events-none absolute inset-0 opacity-50"
      />
      <Container className="relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Through-line + tagline */}
          <div className="lg:col-span-5">
            <p className="text-[clamp(1.5rem,4vw,2rem)] font-semibold tracking-[-0.01em] text-foreground">
              Production follows water.
            </p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
              Building a more resilient world through science, collaboration,
              and sustainable water management.
            </p>
            <Link
              href="/map"
              className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explore the Global Map
            </Link>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Explore
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/map"
                  className="rounded-md text-sm font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Global Map
                </Link>
              </li>
              {FUTURE_PAGES.slice(0, 4).map((p) => (
                <li key={p}>
                  <FuturePageLink>{p}</FuturePageLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* More */}
          <div className="lg:col-span-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Coming soon
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {FUTURE_PAGES.slice(4).map((p) => (
                <li key={p}>
                  <FuturePageLink>{p}</FuturePageLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Funding acknowledgement — verbatim, grant requirement (brief §5.3 / §6) */}
        <div className="mt-14 border-t border-border pt-8">
          <p className="max-w-3xl text-[13px] leading-relaxed text-muted">
            The pilot phase of the ZEDAS Project has been made possible through
            the support of the Danida Fellows Networkers Grant 2026. The grant
            has been provided by Danida Fellowship Centre and the Ministry of
            Foreign Affairs of Denmark.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              <span className="font-semibold text-foreground">
                ZEDAS Project
              </span>{" "}
              · Cámara Argentina del Agua (CAA)
            </p>
            <p>Illustrative pilot release · English</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
