import SiteNav from "@/components/landing/site-nav";
import Hero from "@/components/landing/hero";
import About from "@/components/landing/about";
import Pilot from "@/components/landing/pilot";
import ByTheNumbers from "@/components/landing/by-the-numbers";
import WhyZedas from "@/components/landing/why-zedas";
import Manifesto from "@/components/landing/manifesto";
import Methodology from "@/components/landing/methodology";
import GlobalMap from "@/components/landing/global-map";
import PartnersMarquee from "@/components/landing/partners-marquee";
import Intelligence from "@/components/landing/intelligence";
import JoinBand from "@/components/landing/join-band";
import Acknowledgement from "@/components/landing/acknowledgement";
import SiteFooter from "@/components/landing/site-footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "ZEDAS Project",
      alternateName: "Water Availability and Water-Resilient Economic Zones",
      description:
        "An international initiative combining hydrology, economics, industrial policy, and geospatial intelligence to identify territories suitable for sustainable, water-based production.",
      url: "https://zedas.example.org",
      parentOrganization: { "@type": "Organization", name: "Cámara Argentina del Agua (CAA)" },
    },
    {
      "@type": "WebSite",
      name: "ZEDAS Project",
      url: "https://zedas.example.org",
      description:
        "Mapping the future of water-based production. Production follows water.",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-foreground focus:shadow-md"
      >
        Skip to content
      </a>

      <SiteNav />

      <main id="main">
        <Hero />
        <About />
        <Pilot />
        <PartnersMarquee />
        <ByTheNumbers />
        <WhyZedas />
        <Manifesto />
        <Methodology />
        <GlobalMap />
        <Intelligence />
        <JoinBand />
        <Acknowledgement />
      </main>

      <SiteFooter />
    </>
  );
}
