// Lightweight className combiner. The project composes Tailwind classes with
// plain string joins (no clsx / tailwind-merge dependency), so `cn` just filters
// out falsy values and joins — enough for registry components that expect it.
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}
