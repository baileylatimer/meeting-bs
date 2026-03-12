import type { Speaker } from "~/types/meeting";
import { Badge } from "~/components/shared/Badge";
import { RetroProgressBar } from "~/components/shared/RetroProgressBar";

interface YappersTabProps {
  speakers: Speaker[];
  duration: number;
  aiSummary: string;
}

function SpeakerRow({ speaker, duration }: { speaker: Speaker; duration: number }) {
  const workPct = Math.round((speaker.workMinutes / duration) * 100);
  const offTopicPct = Math.round((speaker.offTopicMinutes / duration) * 100);
  const messagePct = Math.round((speaker.couldBeMessageMinutes / duration) * 100);

  const bsLabel =
    speaker.bsRatio >= 85
      ? "ALL-TALK"
      : speaker.bsRatio >= 75
      ? "MOSTLY NOISE"
      : "EFFICIENT";

  const bsLabelColor =
    speaker.bsRatio >= 85 ? "#D72638" : speaker.bsRatio >= 75 ? "#FF6B6B" : "#22C55E";

  return (
    <div
      className="border-b-2 border-ink"
      style={{ backgroundColor: "#EDE8E1" }}
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 p-4">
        {/* Top: speaker info + stats + bar */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className="flex items-center justify-center border-2 border-ink font-mono font-bold text-sm text-parchment flex-shrink-0"
              style={{ width: 40, height: 40, backgroundColor: speaker.color }}
            >
              {speaker.initials}
            </div>
            <span className="font-sans text-base md:text-lg text-ink">{speaker.name}</span>
            <Badge badge={speaker.badge} />
          </div>

          {/* Stats grid */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <StatBox label="Off topic" value={Math.round(speaker.offTopicMinutes)} unit="MIN" />
            <StatBox label="Work-related" value={Math.round(speaker.workMinutes)} unit="MIN" />
            <StatBox label="Interruptions" value={speaker.interruptions} />
            <StatBox label="Tangents" value={speaker.tangentsStarted} />
          </div>

          {/* Win95 progress bar */}
          <RetroProgressBar
            segments={[
              { value: workPct, color: "green" },
              { value: offTopicPct, color: "red" },
              { value: messagePct, color: "gray" },
            ]}
            blockWidth={10}
            blockHeight={14}
            blockGap={2}
          />
        </div>

        {/* BS ratio panel — inline on sm+, full-width strip on mobile */}
        <div
          className="flex sm:flex-col items-center justify-center sm:flex-shrink-0 mt-3 sm:mt-0 py-3 sm:py-0"
          style={{
            backgroundColor: "#0A0A0A",
            width: "auto",
            padding: "10px 16px",
          }}
        >
          <span
            className="font-sans text-2xl sm:text-3xl leading-none mr-2 sm:mr-0"
            style={{ color: bsLabelColor }}
          >
            {speaker.bsRatio}%
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase sm:mt-1"
            style={{ color: bsLabelColor }}
          >
            {bsLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div>
      <p className="font-mono text-[9px] text-muted tracking-widest uppercase mb-1">{label}</p>
      <div
        className="flex items-center gap-1 border border-ink px-2 py-0.5"
        style={{ backgroundColor: "#EDE8E1" }}
      >
        <span className="font-mono text-sm font-bold text-ink">{value}</span>
        {unit && (
          <span className="font-mono text-[9px] text-muted tracking-widest">{unit}</span>
        )}
      </div>
    </div>
  );
}

export function YappersTab({ speakers, duration, aiSummary }: YappersTabProps) {
  // Find MVP
  const mvp = speakers.find((s) => s.badge === "MEETING_MVP");

  return (
    <div className="flex flex-col md:flex-row" style={{ minHeight: 400 }}>
      {/* Speaker list */}
      <div className="flex-1 md:border-r-2 border-ink">
        {speakers.map((speaker) => (
          <SpeakerRow key={speaker.id} speaker={speaker} duration={duration} />
        ))}

        {/* Meeting MVP callout */}
        {mvp && (
          <div
            className="p-4 border-t-2 border-ink"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-gold text-sm">★</span>
              <div>
                <p className="font-sans text-parchment text-sm">
                  Meeting MVP: {mvp.name}
                </p>
                <p className="font-mono text-xs text-muted mt-1">
                  {mvp.yapperScore}. Started zero tangents. Survived {duration} minutes of nonsense. Give this person their hour back.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI summary + placeholder oval — full width on mobile, 280px sidebar on desktop */}
      <div
        className="flex flex-col justify-between border-t-2 md:border-t-0 border-ink w-full md:w-[280px] md:flex-shrink-0"
        style={{ backgroundColor: "#EDE8E1" }}
      >
        {/* Placeholder for 3D shape — hidden on mobile to save space */}
        <div className="hidden md:flex items-center justify-center flex-1 p-6">
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: "#C8C3BC",
            }}
          />
        </div>

        {/* AI summary blurb */}
        <div className="p-5 border-t-2 border-ink">
          <p className="font-sans text-sm text-ink leading-relaxed">
            <span
              style={{ backgroundColor: "#FF6B6B", padding: "0 4px" }}
            >
              {aiSummary.split(" ")[0]} {aiSummary.split(" ")[1]}
            </span>{" "}
            {aiSummary.split(" ").slice(2).join(" ")}
          </p>
        </div>
      </div>
    </div>
  );
}
