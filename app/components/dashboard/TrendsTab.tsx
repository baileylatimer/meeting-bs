/**
 * TrendsTab — Weekly BS trends over time.
 * Currently shows a "coming soon" state with placeholder UI.
 * When trends data is available, wire up TrendDataPoint[] props.
 */

export function TrendsTab() {
  // Placeholder weekly data — replace with real data when available
  const weeks = [
    { label: "Feb 10", bsScore: 72, grade: "D" },
    { label: "Feb 17", bsScore: 68, grade: "D" },
    { label: "Feb 24", bsScore: 81, grade: "F" },
    { label: "Mar 3", bsScore: 75, grade: "D" },
    { label: "Mar 10", bsScore: 86, grade: "F" },
  ];

  const maxScore = 100;

  return (
    <div style={{ backgroundColor: "#EDE8E1" }}>
      {/* Header */}
      <div
        className="px-5 py-3 border-b-2 border-ink"
        style={{ backgroundColor: "#EDE8E1" }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted">
            WEEKLY BS TREND
          </p>
          <span
            className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5"
            style={{ backgroundColor: "#D5D0CB", color: "#999", border: "1px solid #999" }}
          >
            PLACEHOLDER DATA
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="px-5 py-6 border-b-2 border-ink">
        <div className="flex items-end gap-3 md:gap-6" style={{ height: 120 }}>
          {weeks.map((week, i) => {
            const isLatest = i === weeks.length - 1;
            const barHeight = Math.round((week.bsScore / maxScore) * 100);
            const barColor = week.bsScore >= 80 ? "#D72638" : week.bsScore >= 70 ? "#FF6B6B" : "#F2C744";

            return (
              <div key={i} className="flex flex-col items-center flex-1 gap-1">
                {/* Score label */}
                <span
                  className="font-mono text-[9px] tracking-wide"
                  style={{ color: barColor }}
                >
                  {week.bsScore}%
                </span>

                {/* Bar */}
                <div
                  className="w-full border-2 border-ink"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: isLatest ? barColor : `${barColor}66`,
                    minHeight: 8,
                  }}
                />

                {/* Week label */}
                <span className="font-mono text-[8px] text-muted tracking-wide text-center">
                  {week.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Repeat offenders */}
      <div className="border-b-2 border-ink">
        <div className="px-5 py-3 border-b border-ink/20">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted">
            REPEAT OFFENDERS
          </p>
        </div>
        {[
          { name: "Karen M.", meetings: 5, avgBs: 88 },
          { name: "Dave R.", meetings: 4, avgBs: 79 },
          { name: "Lisa P.", meetings: 3, avgBs: 82 },
        ].map((offender, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-3 border-b border-ink/20"
            style={{ backgroundColor: "#EDE8E1" }}
          >
            <span className="font-sans text-sm text-ink">{offender.name}</span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-muted">{offender.meetings} meetings</span>
              <span
                className="font-mono text-xs"
                style={{ color: offender.avgBs >= 80 ? "#D72638" : "#FF6B6B" }}
              >
                avg {offender.avgBs}% BS
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon notice */}
      <div
        className="p-5 md:p-6"
        style={{ backgroundColor: "#0A0A0A", borderTop: "2px solid #0A0A0A" }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: "#999" }}>
          COMING SOON
        </p>
        <p className="font-sans text-sm leading-relaxed" style={{ color: "#EDE8E1" }}>
          Weekly GPA. Repeat offenders. The long game of wasted time. Trends will populate automatically once you&apos;ve analyzed multiple meetings.
        </p>
      </div>
    </div>
  );
}
