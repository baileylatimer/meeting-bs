/**
 * RetroProgressBar — Windows 95 / chunky segmented progress bar.
 * Renders a row of solid block segments on a recessed gray track.
 * Supports segmented coloring (work=green, offtopic=red, message=gray).
 */

interface Segment {
  value: number; // percentage 0-100
  color: "green" | "red" | "gray";
}

interface RetroProgressBarProps {
  segments: Segment[];
  totalWidth?: number; // not used directly, bar is 100% width
  blockWidth?: number; // px per block
  blockHeight?: number; // px
  blockGap?: number; // px between blocks
  className?: string;
}

const COLOR_MAP = {
  green: "#22C55E",
  red: "#D72638",
  gray: "#999999",
};

export function RetroProgressBar({
  segments,
  blockWidth = 12,
  blockHeight = 16,
  blockGap = 2,
  className = "",
}: RetroProgressBarProps) {
  const totalBlocks = 30;

  // Build an array of block colors based on segment percentages
  const blockColors: string[] = [];
  for (const seg of segments) {
    const count = Math.round((seg.value / 100) * totalBlocks);
    for (let i = 0; i < count; i++) {
      blockColors.push(COLOR_MAP[seg.color]);
    }
  }
  // Pad to totalBlocks
  while (blockColors.length < totalBlocks) {
    blockColors.push("transparent");
  }

  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        backgroundColor: "#D5D0CB",
        border: "1px solid #999",
        padding: "2px",
        display: "inline-flex",
        gap: `${blockGap}px`,
      }}
    >
      {blockColors.slice(0, totalBlocks).map((color, i) => (
        <div
          key={i}
          style={{
            width: blockWidth,
            height: blockHeight,
            backgroundColor: color === "transparent" ? "rgba(0,0,0,0.06)" : color,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
