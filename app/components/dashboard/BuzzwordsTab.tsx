import { useState, useEffect, useRef } from "react";
import type { BuzzwordInstance } from "~/types/meeting";

interface BuzzwordsTabProps {
  buzzwords: BuzzwordInstance[];
  buzzwordsPerMinute: number;
  duration: number;
}

// Color tiers based on count relative to max
function getBubbleColor(count: number, maxCount: number): string {
  const ratio = count / maxCount;
  if (ratio >= 0.7) return "#FF6B6B";   // coral — top tier
  if (ratio >= 0.45) return "#F59E0B";  // orange — mid-high
  if (ratio >= 0.25) return "#F2C744";  // gold — mid
  return "#D5D0CB";                      // gray — low
}

function getBubbleSize(count: number, maxCount: number) {
  const ratio = count / maxCount;
  if (ratio >= 0.7) return { fontSize: "0.9rem", padding: "9px 18px" };
  if (ratio >= 0.45) return { fontSize: "0.8rem", padding: "7px 14px" };
  if (ratio >= 0.25) return { fontSize: "0.72rem", padding: "6px 12px" };
  return { fontSize: "0.65rem", padding: "5px 10px" };
}

export function BuzzwordsTab({ buzzwords, buzzwordsPerMinute, duration }: BuzzwordsTabProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const bubblesRef = useRef<(HTMLSpanElement | null)[]>([]);

  const sorted = [...(buzzwords ?? [])].sort((a, b) => b.count - a.count);
  const maxCount = sorted[0]?.count ?? 1;

  // GSAP floating animation — client-only via dynamic import (avoids SSR issues)
  useEffect(() => {
    if (sorted.length === 0) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tweens: any[] = [];

    import("gsap").then(({ gsap }) => {
      tweens = bubblesRef.current.map((el) => {
        if (!el) return null;
        const yAmt = 2 + Math.random() * 4;       // 2–6px vertical drift
        const xAmt = 1 + Math.random() * 2.5;     // 1–3.5px horizontal drift
        const rot = (Math.random() - 0.5) * 2.5;  // ±1.25° rotation
        const dur = 4 + Math.random() * 3;         // 4–7s per cycle (slow + dreamy)
        const delay = Math.random() * 4;           // spread out starts

        return gsap.fromTo(
          el,
          { y: -yAmt / 2, x: -xAmt / 2, rotation: -rot / 2 },
          {
            y: yAmt / 2,
            x: xAmt / 2,
            rotation: rot / 2,
            duration: dur,
            delay,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      });
    });

    return () => {
      tweens.forEach((t) => t?.kill());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted.length]);

  if (sorted.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ minHeight: 400, backgroundColor: "#EDE8E1" }}
      >
        <div className="text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-muted mb-2">CLEAN MEETING</p>
          <p className="font-sans text-2xl text-ink">No buzzwords detected.</p>
          <p className="font-mono text-sm text-muted mt-2">Either everyone spoke plainly or the AI is broken.</p>
        </div>
      </div>
    );
  }

  const totalCount = buzzwords.reduce((sum, b) => sum + b.count, 0);
  const topOffender = sorted[0];

  return (
    <div style={{ backgroundColor: "#EDE8E1" }}>

      {/* ── Section 1: Floating bubble cloud ── */}
      <div className="border-b-2 border-ink">
        <div className="px-5 py-3 border-b-2 border-ink">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted">
            CORPORATE BS BINGO
          </p>
        </div>

        <div
          className="flex flex-wrap gap-3 p-6 md:p-8 justify-center"
          style={{ minHeight: 160 }}
        >
          {sorted.map((bw, i) => {
            const color = getBubbleColor(bw.count, maxCount);
            const size = getBubbleSize(bw.count, maxCount);

            return (
              <span
                key={i}
                ref={(el) => { bubblesRef.current[i] = el; }}
                className="font-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 999,
                  padding: size.padding,
                  fontSize: size.fontSize,
                  backgroundColor: color,
                  color: "#0A0A0A",
                  whiteSpace: "nowrap",
                  willChange: "transform",
                }}
              >
                {bw.phrase}
                <span style={{ fontSize: "0.6rem", opacity: 0.7, letterSpacing: "0.05em" }}>
                  ×{bw.count}
                </span>
              </span>
            );
          })}
        </div>

        <p className="font-mono text-[9px] text-muted text-center pb-4 tracking-wide">
          tap a row below for translations
        </p>
      </div>

      {/* ── Section 2: BS → English translator ── */}
      <div className="border-b-2 border-ink">
        <div className="px-5 py-3 border-b-2 border-ink">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted">
            BS → ENGLISH TRANSLATOR
          </p>
        </div>

        {sorted.map((bw, i) => (
          <div key={i} className="border-b border-ink/20">
            <button
              className="w-full text-left px-5 py-3 flex items-center justify-between gap-3"
              style={{ backgroundColor: "#EDE8E1", cursor: "pointer", border: "none" }}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-sans text-sm text-ink">
                  &ldquo;{bw.phrase}&rdquo;
                </span>
                <span className="font-mono text-[10px] text-muted">×{bw.count}</span>
                <span className="font-mono text-[10px]" style={{ color: "#999" }}>·</span>
                <span className="font-mono text-[10px] text-muted">{bw.primarySpeaker}</span>
              </div>
              <span
                className="font-mono text-[10px] text-muted flex-shrink-0"
                style={{
                  transform: expanded === i ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s",
                  display: "inline-block",
                }}
              >
                ▼
              </span>
            </button>

            {expanded === i && (
              <div
                className="px-5 pb-3"
                style={{ backgroundColor: "#D5D0CB", borderTop: "1px solid #0A0A0A" }}
              >
                <p className="font-mono text-[11px] text-ink leading-relaxed pt-3">
                  &ldquo;{bw.translation}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Summary ── */}
      <div
        className="p-5 md:p-6"
        style={{ backgroundColor: "#F2C744", borderTop: "2px solid #0A0A0A" }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink mb-2">
          JARGON REPORT
        </p>
        <p className="font-sans text-sm text-ink leading-relaxed">
          <span style={{ backgroundColor: "#0A0A0A", color: "#F2C744", padding: "0 4px" }}>
            {totalCount} buzzwords
          </span>{" "}
          detected across {duration} minutes ({buzzwordsPerMinute.toFixed(2)}/min).{" "}
          {topOffender && (
            <>
              &ldquo;{topOffender.phrase}&rdquo; led the pack at{" "}
              <span style={{ backgroundColor: "#0A0A0A", color: "#EDE8E1", padding: "0 4px" }}>
                {topOffender.count}×
              </span>
              .
            </>
          )}
        </p>
      </div>
    </div>
  );
}
