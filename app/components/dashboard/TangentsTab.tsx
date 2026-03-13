import type { Tangent, Speaker } from "~/types/meeting";

interface TangentsTabProps {
  tangents: Tangent[];
  speakers: Speaker[];
}

// Category → emoji mapping
const CATEGORY_EMOJI: Record<string, string> = {
  fitness: "💪",
  travel: "✈️",
  sports: "🏈",
  gossip: "💬",
  food: "🍕",
  tech: "💻",
  weather: "🌤️",
  politics: "🗳️",
  default: "🌀",
};

export function TangentsTab({ tangents, speakers }: TangentsTabProps) {
  if (!tangents || tangents.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: 400, backgroundColor: "#EDE8E1" }}
      >
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-muted mb-2">CLEAN MEETING</p>
          <p className="font-sans text-2xl text-ink">No tangents detected.</p>
          <p className="font-mono text-sm text-muted mt-2">Somehow everyone stayed on topic.</p>
        </div>
      </div>
    );
  }

  // Compute summary stats from data
  const totalMinutesLost = tangents.reduce((sum, t) => sum + t.durationMinutes, 0);
  const totalCost = tangents.reduce((sum, t) => sum + t.costDollars, 0);

  // Find worst offender (most tangents started)
  const offenderCounts: Record<string, number> = {};
  tangents.forEach((t) => {
    offenderCounts[t.triggeredBy] = (offenderCounts[t.triggeredBy] || 0) + 1;
  });
  const worstOffender = Object.entries(offenderCounts).sort((a, b) => b[1] - a[1])[0];

  // Find speaker color for a given name
  const getSpeakerColor = (name: string): string => {
    const speaker = speakers.find((s) => s.name === name);
    return speaker?.color ?? "#999";
  };

  return (
    <div style={{ backgroundColor: "#EDE8E1" }}>
      {/* Header */}
      <div
        className="px-5 py-3 border-b-2 border-ink"
        style={{ backgroundColor: "#EDE8E1" }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted">
          DERAILMENT PLAY-BY-PLAY
        </p>
      </div>

      {/* Tangent cards */}
      <div>
        {tangents.map((tangent, i) => {
          const emoji = CATEGORY_EMOJI[tangent.category] ?? CATEGORY_EMOJI.default;
          const speakerColor = getSpeakerColor(tangent.triggeredBy);

          return (
            <div
              key={i}
              className="border-b-2 border-ink"
              style={{ backgroundColor: "#EDE8E1" }}
            >
              {/* Left accent bar + content */}
              <div className="flex">
                {/* Left color bar */}
                <div
                  style={{
                    width: 4,
                    flexShrink: 0,
                    backgroundColor: speakerColor,
                  }}
                />

                {/* Card content */}
                <div className="flex-1 px-4 py-4 md:px-5 md:py-5">
                  {/* Top row: timestamp + speaker + minutes lost */}
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="font-mono text-sm"
                        style={{ color: "#FF6B6B" }}
                      >
                        {tangent.timestamp}
                      </span>
                      <span className="font-sans text-sm text-ink">
                        {tangent.triggeredBy}
                      </span>
                      <span style={{ fontSize: 14 }}>{emoji}</span>
                    </div>
                    <span
                      className="font-mono text-xs tracking-wide flex-shrink-0"
                      style={{ color: "#FF6B6B" }}
                    >
                      {tangent.durationMinutes} min lost
                    </span>
                  </div>

                  {/* Trigger quote */}
                  <p
                    className="font-sans text-sm text-ink mb-2"
                    style={{ fontStyle: "italic" }}
                  >
                    &ldquo;{tangent.triggerQuote}&rdquo;
                  </p>

                  {/* Cost */}
                  <p className="font-mono text-[10px] text-muted tracking-wide uppercase">
                    This tangent cost ~${tangent.costDollars.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tangent Summary */}
      <div
        className="p-5 md:p-6"
        style={{ backgroundColor: "#FF6B6B", borderTop: "2px solid #0A0A0A" }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink mb-2">
          TANGENT SUMMARY
        </p>
        <p className="font-sans text-sm text-ink leading-relaxed">
          <span className="font-sans" style={{ backgroundColor: "#0A0A0A", color: "#FF6B6B", padding: "0 4px" }}>
            {tangents.length} tangent{tangents.length !== 1 ? "s" : ""}
          </span>{" "}
          derailed this meeting.{" "}
          {worstOffender && worstOffender[1] > 1 && (
            <>
              {worstOffender[0]} started{" "}
              <span style={{ backgroundColor: "#0A0A0A", color: "#EDE8E1", padding: "0 4px" }}>
                {worstOffender[1]} of them
              </span>
              .{" "}
            </>
          )}
          Total time lost to tangents:{" "}
          <span style={{ backgroundColor: "#0A0A0A", color: "#FF6B6B", padding: "0 4px" }}>
            {totalMinutesLost} minutes
          </span>
          {" "}(${totalCost.toLocaleString()} wasted).
        </p>
      </div>
    </div>
  );
}
