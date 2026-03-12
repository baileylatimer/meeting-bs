import type { SpeakerBadge } from "~/types/meeting";

const BADGE_CONFIG: Record<
  NonNullable<SpeakerBadge>,
  { label: string; bg: string; text: string }
> = {
  TOP_YAPPER: { label: "TOP YAPPER", bg: "#FF6B6B", text: "#0A0A0A" },
  MEETING_MVP: { label: "MEETING MVP", bg: "#0A0A0A", text: "#FFFFFF" },
  PIGGYBACKER: { label: "PIGGYBACKER", bg: "#FF6B6B", text: "#0A0A0A" },
  MEETING_ENTHUSIAST: { label: "MEETING ENTHUSIAST", bg: "#FF6B6B", text: "#0A0A0A" },
  HOSTAGE: { label: "HOSTAGE", bg: "#0A0A0A", text: "#FFFFFF" },
};

interface BadgeProps {
  badge: SpeakerBadge;
  className?: string;
}

export function Badge({ badge, className = "" }: BadgeProps) {
  if (!badge) return null;
  const config = BADGE_CONFIG[badge];
  return (
    <span
      className={`inline-block font-mono text-[10px] font-bold tracking-widest px-2 py-0.5 ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        letterSpacing: "0.12em",
      }}
    >
      {config.label}
    </span>
  );
}
