import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

const SITE_URL = "https://zedas.example.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZEDAS Project — Mapping the Future of Water-Based Production",
    template: "%s · ZEDAS Project",
  },
  description:
    "ZEDAS is building the world's first global platform to identify territories where water availability, quality, resilience, and governance can support long-term economic development. Production follows water.",
  applicationName: "ZEDAS Project",
  keywords: [
    "water",
    "water-based production",
    "water intelligence",
    "water resilience",
    "economic zones",
    "hydrology",
    "industrial policy",
    "Cámara Argentina del Agua",
  ],
  authors: [{ name: "Cámara Argentina del Agua (CAA)" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "ZEDAS Project",
    title: "ZEDAS Project — Mapping the Future of Water-Based Production",
    description:
      "As water becomes the strategic constraint on industry, the question flips: where should production go, according to water? Explore the global pilot map.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEDAS Project — Mapping the Future of Water-Based Production",
    description:
      "The world's first global platform identifying where water can support long-term economic development. Production follows water.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060d11" },
  ],
};

// Resolve the theme before first paint to avoid a flash / hydration mismatch.
const themeScript = `(function(){try{var t=localStorage.getItem('zedas-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
