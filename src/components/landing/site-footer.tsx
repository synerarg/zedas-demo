import Link from "next/link";
import { Send } from "lucide-react";
import { Container } from "./primitives";
import { whatsappHref } from "@/lib/contact";

const WHATSAPP_HREF = whatsappHref();

// Real, in-page destinations (the sections that exist today) plus the map page.
const EXPLORE_LINKS = [
  { href: "/map", label: "Global Map", page: true },
  { href: "#about", label: "About ZEDAS" },
  { href: "#pilot", label: "The Pilot" },
  { href: "#why", label: "Why ZEDAS" },
];

const PROJECT_LINKS = [
  { href: "#methodology", label: "Methodology" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#acknowledgement", label: "Acknowledgement" },
];

const LINK_CLASS =
  "rounded-md text-sm font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

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
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  {l.page ? (
                    <Link href={l.href} className={LINK_CLASS}>
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className={LINK_CLASS}>
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Project */}
          <div className="lg:col-span-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Project
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {PROJECT_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={LINK_CLASS}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-foreground transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Send className="size-4 text-accent" aria-hidden />
                  Contact on WhatsApp
                </a>
              </li>
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
