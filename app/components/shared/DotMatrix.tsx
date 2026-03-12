/**
 * DotMatrix — renders a number as a dot-matrix display (3×5 grid per digit)
 * Active dots are colored, inactive dots are very faint.
 */

// 3×5 dot patterns for digits 0–9 and % sign
const DIGIT_PATTERNS: Record<string, number[][]> = {
  "0": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "1": [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "2": [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  "3": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "4": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "5": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "6": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "7": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  "8": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "9": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  "%": [
    [1, 0, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 0, 1],
  ],
  " ": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
};

interface DotMatrixProps {
  value: string | number;
  color?: string; // active dot color, defaults to coral
  dotSize?: number; // px
  gap?: number; // px between dots
  className?: string;
}

export function DotMatrix({
  value,
  color = "#FF6B6B",
  dotSize = 6,
  gap = 3,
  className = "",
}: DotMatrixProps) {
  const chars = String(value).split("");

  return (
    <div className={`flex items-start ${className}`} style={{ gap: `${gap * 3}px` }}>
      {chars.map((char, charIdx) => {
        const pattern = DIGIT_PATTERNS[char] ?? DIGIT_PATTERNS[" "];
        return (
          <div
            key={charIdx}
            style={{ display: "grid", gridTemplateColumns: `repeat(3, ${dotSize}px)`, gap: `${gap}px` }}
          >
            {pattern.flat().map((active, dotIdx) => (
              <div
                key={dotIdx}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  backgroundColor: active ? color : "rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
