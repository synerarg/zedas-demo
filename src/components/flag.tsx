import { FLAGS } from "@/lib/layers";

/**
 * Derive the ISO 3166-1 alpha-2 code from a flag emoji. Flag emoji are two
 * Regional Indicator Symbols (U+1F1E6 = 'A' … U+1F1FF = 'Z'), so each maps back
 * to a letter. We reuse the existing FLAGS table rather than duplicating codes.
 */
function countryCode(isoN: number): string | null {
  const emoji = FLAGS[isoN];
  if (!emoji) return null;
  const cps = Array.from(emoji).map((c) => c.codePointAt(0) ?? 0);
  if (cps.length < 2) return null;
  const cc = cps
    .slice(0, 2)
    .map((cp) => String.fromCharCode(cp - 0x1f1e6 + 65))
    .join("");
  return /^[A-Z]{2}$/.test(cc) ? cc.toLowerCase() : null;
}

interface FlagProps {
  isoN: number;
  /** When provided, the flag is exposed to assistive tech; otherwise decorative
   *  (the country name is always shown alongside it). */
  name?: string;
  /** Sizing utilities — keep a fixed height + `w-auto` so flags never distort
   *  (some, like Nepal's, aren't 3:2). */
  className?: string;
}

/** Real flag image for a pilot country — renders on every OS, unlike the flag
 *  emoji which Windows shows as the bare country code ("MX"). */
export default function Flag({ isoN, name, className = "h-5 w-auto" }: FlagProps) {
  const cc = countryCode(isoN);
  if (!cc) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static CDN icon
    <img
      src={`https://flagcdn.com/${cc}.svg`}
      alt={name ? `Flag of ${name}` : ""}
      aria-hidden={name ? undefined : true}
      loading="lazy"
      decoding="async"
      className={`shrink-0 rounded-[3px] ring-1 ring-black/10 ${className}`}
    />
  );
}
