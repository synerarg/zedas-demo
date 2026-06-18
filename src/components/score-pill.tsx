import { PROFILE_COLOR, type Profile } from "@/lib/zedas-data";
import { profileTextColor } from "@/lib/layers";

interface ScorePillProps {
  profile: Profile;
  size?: "sm" | "md";
}

/** Zedas Score profile as a colored pill. Color is always paired with the
 *  text label — meaning is never carried by color alone. */
export default function ScorePill({ profile, size = "md" }: ScorePillProps) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full font-medium leading-tight ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      }`}
      style={{
        backgroundColor: PROFILE_COLOR[profile],
        color: profileTextColor(profile),
      }}
    >
      {profile}
    </span>
  );
}
