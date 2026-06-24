"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useTheme } from "@/lib/use-theme";
import ThemeToggle from "@/components/theme-toggle";

// In-page sections that exist today.
const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#pilot", label: "The Pilot" },
  { href: "#why", label: "Why ZEDAS" },
  { href: "#methodology", label: "Methodology" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#acknowledgement", label: "Acknowledgement" },
];

// Phase-2 top-level pages (Gonzalo's full IA). Present but disabled so the
// information architecture is visibly ready to grow — see brief §4.
const FUTURE_PAGES = [
  "The Water Century",
  "Pilot Countries",
  "Focal Points",
  "Partners",
  "Knowledge Hub",
  "Contact",
];

export default function SiteNav() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[var(--z-nav)] transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="justify-self-start rounded-md text-base font-bold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          ZEDAS<span className="font-medium text-muted"> Project</span>
        </Link>

        <div className="hidden items-center gap-1 justify-self-center md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <ThemeToggle theme={theme} onToggle={toggle} />
          <Link
            href="/map"
            className="group hidden h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition-[transform,background-color] duration-200 ease-[var(--ease-out-quart)] hover:bg-accent/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:inline-flex"
          >
            Explore the Global Map
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-[var(--ease-out-quart)] group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface/90 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:hidden"
          >
            {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Coming soon
            </p>
            <ul className="mt-1 flex flex-col">
              {FUTURE_PAGES.map((p) => (
                <li key={p}>
                  <span
                    aria-disabled="true"
                    className="flex items-center justify-between rounded-md px-2 py-2.5 text-sm text-muted/70"
                  >
                    {p}
                    <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                      Soon
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/map"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground shadow-sm transition-transform duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explore the Global Map
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
