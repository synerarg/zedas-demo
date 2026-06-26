import Image from "next/image";
import Reveal from "./reveal";
import { Container } from "./primitives";

// Data partners shown beneath the global map. The marks live at the /public root
// (served from /). They are PLACEHOLDER lockups — monochrome dark ink on a
// transparent ground, sitting at 60% on the light surface. To use the real brand
// assets, drop PNGs at the same paths. The width/height are the files' intrinsic
// pixels — aspect hints only; the rendered size is driven entirely by the
// className (h-8 md:h-9, w-auto).
const PARTNERS = [
  { src: "/LatamWater.png", alt: "Latam Water", width: 610, height: 154 },
  { src: "/CAA.png", alt: "Cámara Argentina del Agua", width: 621, height: 146 },
  { src: "/UNDelta.png", alt: "UN Delta", width: 459, height: 130 },
];

// Default: a soft, uniform 60% so the strip reads as a quiet wall, not a row of
// loud badges. Each mark lifts to full on hover (the marquee also pauses then).
const LOGO_CLASS =
  "h-8 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-9";

function Logo({
  partner,
  decorative = false,
}: {
  partner: (typeof PARTNERS)[number];
  decorative?: boolean;
}) {
  return (
    <Image
      src={partner.src}
      alt={decorative ? "" : partner.alt}
      width={partner.width}
      height={partner.height}
      sizes="160px"
      className={LOGO_CLASS}
    />
  );
}

// The 3 partners repeated 4× make one group wider than the viewport, so a single
// group already reads as a continuous strip. The marquee stacks two identical
// groups and slides by one group width (translateX(-50%)) for a seamless loop.
const GROUP = Array.from({ length: 4 }, () => PARTNERS).flat();

function MarqueeGroup({ hidden = false }: { hidden?: boolean }) {
  // The trailing padding equals the inter-item gap, so the spacing across the
  // group boundary matches the spacing within a group — no wider/narrower seam.
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-12 pr-12 md:gap-20 md:pr-20"
    >
      {GROUP.map((partner, i) => (
        <li key={i} className="flex shrink-0 items-center">
          {/* Announce each partner once: real alt on the first three, decorative
              on the repeats; the entire duplicate group is aria-hidden. */}
          <Logo partner={partner} decorative={hidden || i >= PARTNERS.length} />
        </li>
      ))}
    </ul>
  );
}

export default function PartnersMarquee() {
  return (
    <section
      aria-label="Data partners"
      className="border-t border-border py-16 md:py-24"
    >
      <Container>
        <Reveal
          as="p"
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted"
        >
          Data partners
        </Reveal>
      </Container>

      {/* Animated strip — full-bleed, with a symmetric edge fade (a mask, so it
          sits cleanly over the flat surface). Hidden under reduced motion;
          the static row below takes over. */}
      <div className="zd-marquee group relative mt-8 overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] motion-reduce:hidden md:mt-10">
        <div className="flex w-max [animation:zedas-marquee_38s_linear_infinite] group-hover:[animation-play-state:paused]">
          <MarqueeGroup />
          <MarqueeGroup hidden />
        </div>
      </div>

      {/* Reduced-motion fallback: one static, centered row of the three marks. */}
      <Container className="mt-8 hidden motion-reduce:block md:mt-10">
        <ul className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
          {PARTNERS.map((partner) => (
            <li key={partner.src} className="flex items-center">
              <Logo partner={partner} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
