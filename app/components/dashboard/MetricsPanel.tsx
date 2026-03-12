import { DotMatrix } from "~/components/shared/DotMatrix";

interface MetricsPanelProps {
  bsScore: number;
  workMinutes: number;
  duration: number;
  buzzwordCount: number;
  grade: string;
}

export function MetricsPanel({
  bsScore,
  workMinutes,
  duration,
  buzzwordCount,
  grade,
}: MetricsPanelProps) {
  return (
    <div
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="flex">
        {/* BS Score */}
        <div className="flex-1 px-6 py-5 border-r border-white/10">
          <p className="font-sans text-parchment text-lg mb-4">BS Score</p>
          <div className="flex items-end gap-3">
            <DotMatrix value={bsScore} color="#FF6B6B" dotSize={8} gap={4} />
            <span className="font-mono text-coral text-2xl font-bold mb-1">%</span>
          </div>
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase mt-3">
            OF MEETING WAS NONSENSE
          </p>
        </div>

        {/* Actual Work */}
        <div className="flex-1 px-6 py-5 border-r border-white/10">
          <p className="font-sans text-parchment text-lg mb-4">Actual work</p>
          <div className="flex items-end gap-3">
            <DotMatrix value={Math.round(workMinutes)} color="#F2C744" dotSize={8} gap={4} />
            <span className="font-mono text-gold text-2xl font-bold mb-1">min</span>
          </div>
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase mt-3">
            OF {duration} MIN MEETING
          </p>
        </div>

        {/* Buzzwords */}
        <div className="flex-1 px-6 py-5 border-r border-white/10">
          <p className="font-sans text-parchment text-lg mb-4">Buzzwords</p>
          <div className="flex items-end gap-3">
            <DotMatrix value={buzzwordCount} color="#FF6B6B" dotSize={8} gap={4} />
            <span className="font-mono text-coral text-2xl font-bold mb-1">used</span>
          </div>
          <p className="font-mono text-[10px] text-muted tracking-widest uppercase mt-3">
            CORPORATE JARGON DETECTED
          </p>
        </div>

        {/* Grade — right side, larger */}
        <div
          className="flex flex-col items-center justify-center px-8 py-5"
          style={{ minWidth: 120 }}
        >
          <div
            className="flex items-center justify-center border-2 border-parchment/20"
            style={{ width: 72, height: 72 }}
          >
            <span
              className="font-sans text-5xl leading-none"
              style={{ color: grade === "F" ? "#D72638" : grade === "A" ? "#22C55E" : "#F2C744" }}
            >
              {grade}
            </span>
          </div>
          <p className="font-mono text-[9px] text-muted tracking-widest uppercase mt-2">
            MEETING GRADE
          </p>
        </div>
      </div>
    </div>
  );
}
