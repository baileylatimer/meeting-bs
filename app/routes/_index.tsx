import { useState, useEffect, useRef } from "react";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { DotMatrix } from "~/components/shared/DotMatrix";

export const meta: MetaFunction = () => [
  { title: "MeetingBS — Find out if your meeting should've been an email" },
  { name: "description", content: "Upload a meeting recording. Get a BS Score, yapper rankings, dollar cost, and a shareable receipt." },
];

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, delay = 0): number {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        setValue(target);
        clearInterval(id);
      } else {
        setValue(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(id);
  }, [started, target, duration]);

  return value;
}

// ─── Mini Receipt ─────────────────────────────────────────────────────────────
function MiniReceipt({ visible }: { visible: boolean }) {
  const rows = [
    { label: "Duration", value: "57 min", red: false, bold: false },
    { label: "Actual work", value: "8 min", red: false, bold: true },
    { label: "Off-topic", value: "43.5 min", red: true, bold: false },
    { label: "Decisions", value: "0", red: true, bold: false },
    { label: "Buzzwords", value: "37", red: false, bold: false },
  ];

  return (
    <div
      style={{
        backgroundColor: "#EDE8E1",
        border: "2px solid #0A0A0A",
        padding: "24px 20px",
        width: 300,
        flexShrink: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) rotate(1.5deg)" : "translateY(40px) rotate(1.5deg)",
        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
        boxShadow: "8px 8px 0 #0A0A0A",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "1px dashed #0A0A0A",
          paddingBottom: 12,
          marginBottom: 12,
        }}
      >
        <div className="font-sans text-ink" style={{ fontSize: 18 }}>MEETING RECEIPT</div>
        <div className="font-mono text-muted" style={{ fontSize: 10, marginTop: 4 }}>
          11.03.2026 · 14:00
        </div>
      </div>

      {/* Line items */}
      <div className="font-mono" style={{ fontSize: 11 }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
              borderBottom: "1px solid #D5D0CB",
            }}
          >
            <span className="text-muted">{row.label}</span>
            <span style={{ color: row.red ? "#D72638" : "#0A0A0A" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          borderTop: "2px solid #0A0A0A",
          marginTop: 12,
          paddingTop: 12,
          display: "flex",
          justifyContent: "space-between",
        }}
        className="font-mono"
      >
        <span className="text-ink" style={{ fontSize: 12 }}>$ WASTED</span>
        <span style={{ fontSize: 12, color: "#D72638" }}>$3,612</span>
      </div>

      {/* BS Score dot matrix */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0A0A0A",
            padding: "8px 16px",
          }}
        >
          <DotMatrix value="86%" color="#FF6B6B" dotSize={4} gap={2} />
        </div>
        <div
          className="font-mono text-muted"
          style={{ fontSize: 9, marginTop: 8, letterSpacing: "1px", textTransform: "uppercase" }}
        >
          THANK YOU FOR WASTING<br />EVERYONE&apos;S TIME
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function Index() {
  const [visible, setVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const meetings = useCounter(12847, 2500, 600);
  const hours = useCounter(4291, 2500, 800);
  const avgBs = useCounter(71, 2000, 1000);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setProcessing(true);
    // TODO: wire up real upload
    setTimeout(() => setProcessing(false), 3000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EDE8E1", color: "#0A0A0A" }}>

      {/* ── Nav ── */}
      <nav
        className="flex items-center justify-between"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px 32px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.5s ease-out 0.1s, transform 0.5s ease-out 0.1s",
        }}
      >
        <div className="font-sans text-ink" style={{ fontSize: 24, letterSpacing: "-0.5px" }}>
          MeetingBS
        </div>
        <div className="flex items-center gap-5">
          <a
            href="#how"
            className="font-mono text-muted"
            style={{ fontSize: 11, textDecoration: "none", letterSpacing: "0.5px" }}
          >
            How it works
          </a>
          <button
            onClick={() => fileRef.current?.click()}
            className="font-mono text-ink border-2 border-ink"
            style={{
              fontSize: 11,
              letterSpacing: "1px",
              padding: "8px 18px",
              background: "transparent",
              cursor: "pointer",
              transition: "background-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0A0A0A";
              (e.currentTarget as HTMLButtonElement).style.color = "#EDE8E1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#0A0A0A";
            }}
          >
            UPLOAD →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 32px 60px",
          display: "flex",
          alignItems: "flex-start",
          gap: 60,
        }}
      >
        {/* Left */}
        <div style={{ flex: 1, paddingTop: 20 }}>
          <div
            className="font-mono text-muted"
            style={{
              fontSize: 10,
              letterSpacing: "2px",
              marginBottom: 16,
              textTransform: "uppercase",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.2s",
            }}
          >
            Free tool · No signup
          </div>

          <h1
            className="font-sans text-ink"
            style={{
              fontSize: 48,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              marginBottom: 24,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            Find out if your<br />
            meeting should've<br />
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#FF6B6B",
                padding: "0 8px",
                color: "#0A0A0A",
              }}
            >
              been an email.
            </span>
          </h1>

          <p
            className="font-sans"
            style={{
              fontSize: 16,
              color: "#666",
              lineHeight: 1.6,
              maxWidth: 440,
              marginBottom: 32,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease-out 0.5s",
            }}
          >
            Upload a recording. We&apos;ll tell you who wasted the most time, how much it cost, and how many times someone said &ldquo;circle back.&rdquo;
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease-out 0.6s, transform 0.5s ease-out 0.6s",
            }}
          >
            <button
              onClick={() => fileRef.current?.click()}
              className="font-sans text-parchment bg-ink border-2 border-ink"
              style={{
                fontSize: 15,
                padding: "14px 32px",
                cursor: "pointer",
                letterSpacing: "0.5px",
                transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "#D72638";
                el.style.borderColor = "#D72638";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "#0A0A0A";
                el.style.borderColor = "#0A0A0A";
              }}
            >
              Upload Meeting
            </button>
            <Link
              to="/analyze/mock-001"
              className="font-sans text-muted"
              style={{
                fontSize: 15,
                padding: "14px 32px",
                border: "2px solid #D5D0CB",
                textDecoration: "none",
                display: "inline-block",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "#0A0A0A";
                el.style.color = "#0A0A0A";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "#D5D0CB";
                el.style.color = "#999";
              }}
            >
              See a sample →
            </Link>
          </div>

          {/* Feature tags */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 24,
              flexWrap: "wrap",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 0.8s",
            }}
          >
            {["BS Score", "Yapper Rankings", "$ Cost", "Buzzword Counter", "Shareable Receipt"].map((tag) => (
              <span
                key={tag}
                className="font-mono text-muted"
                style={{
                  fontSize: 10,
                  padding: "4px 10px",
                  border: "1px solid #D5D0CB",
                  letterSpacing: "0.5px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — mini receipt */}
        <MiniReceipt visible={visible} />
      </section>

      {/* ── Stats bar ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 60px" }}>
        <div className="flex border-2 border-ink">
          {[
            { label: "MEETINGS ANALYZED", value: meetings.toLocaleString() },
            { label: "HOURS OF BS EXPOSED", value: `${hours.toLocaleString()}h` },
            { label: "AVG BS SCORE", value: `${avgBs}%` },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex-1 text-center"
              style={{
                padding: "20px 24px",
                borderRight: i < 2 ? "1px solid #D5D0CB" : "none",
              }}
            >
              <div
                className="font-mono text-muted"
                style={{ fontSize: 9, letterSpacing: "2px", marginBottom: 6, textTransform: "uppercase" }}
              >
                {stat.label}
              </div>
              <div
                className="font-mono text-ink"
                style={{ fontSize: 24, letterSpacing: "-1px" }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Upload zone ── */}
      <section id="upload" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div className="text-center" style={{ marginBottom: 20 }}>
          <h2 className="font-sans text-ink" style={{ fontSize: 28, letterSpacing: "-0.5px" }}>
            Drop the evidence.
          </h2>
          <p className="font-mono text-muted" style={{ fontSize: 11, marginTop: 6, letterSpacing: "0.5px" }}>
            MP3 · MP4 · WAV · M4A — up to 2 hours
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }}
          role="button"
          tabIndex={0}
          aria-label="Upload meeting recording"
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "56px 40px",
            border: `2px ${isDragging ? "solid" : "dashed"} ${isDragging ? "#D72638" : "#0A0A0A"}`,
            backgroundColor: isDragging ? "rgba(215,38,56,0.04)" : "transparent",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s, background-color 0.2s",
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="audio/*,video/*"
            style={{ display: "none" }}
          />
          {processing ? (
            <>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid #D5D0CB",
                  borderTopColor: "#D72638",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <div className="font-sans text-ink" style={{ fontSize: 15 }}>
                Analyzing<span style={{ animation: "blink 1s step-end infinite" }}>_</span>
              </div>
              <div className="font-mono text-muted" style={{ fontSize: 11, marginTop: 4 }}>
                Identifying speakers · Detecting BS
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{isDragging ? "↓" : "🎙"}</div>
              <div className="font-sans text-ink" style={{ fontSize: 15 }}>
                {isDragging ? "Drop it." : "Drag & drop your recording"}
              </div>
              <div className="font-mono text-muted" style={{ fontSize: 11, marginTop: 6 }}>
                or click to browse
              </div>
            </>
          )}
        </div>

        <div
          className="font-mono text-muted text-center"
          style={{ fontSize: 10, marginTop: 12 }}
        >
          Audio is processed and immediately deleted. We don&apos;t store recordings.
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div
          className="font-mono text-muted"
          style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}
        >
          Process
        </div>
        <h2
          className="font-sans text-ink"
          style={{ fontSize: 28, letterSpacing: "-0.5px", marginBottom: 32 }}
        >
          Three steps to accountability.
        </h2>

        <div className="border-2 border-ink" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { n: "01", title: "Upload the evidence", desc: "Drop your meeting recording. Any format from Zoom, Meet, Teams, or your phone." },
            { n: "02", title: "AI does the work", desc: "We identify each speaker, classify every minute, count the buzzwords, calculate the damage." },
            { n: "03", title: "Share the receipt", desc: "Get a shareable report with the BS Score, yapper rankings, and a verdict on the meeting." },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                padding: "28px 24px",
                borderRight: i < 2 ? "1px solid #D5D0CB" : "none",
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: 11, color: "#D72638", marginBottom: 12, letterSpacing: "1px" }}
              >
                {step.n}
              </div>
              <div className="font-sans text-ink" style={{ fontSize: 17, marginBottom: 8 }}>
                {step.title}
              </div>
              <div className="font-mono text-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div
          className="font-mono text-muted"
          style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}
        >
          Features
        </div>
        <h2
          className="font-sans text-ink"
          style={{ fontSize: 28, letterSpacing: "-0.5px", marginBottom: 32 }}
        >
          Everything you need to expose a bad meeting.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { title: "Meeting Receipt", desc: "A receipt-style breakdown showing where every minute and dollar went. Designed to be screenshotted." },
            { title: "Yapper Rankings", desc: "Who talked the most and produced the least. Words spoken vs. action items — the ratio is devastating." },
            { title: "Tangent Log", desc: "Every derailment logged with the exact quote that started it, who said it, and how much time it burned." },
            { title: "Meeting MVP", desc: "Recognition for the person who spoke least but contributed most. Survived 53 minutes? You\u2019re the MVP." },
            { title: "BS Translator", desc: "\u201cCircle back\u201d \u2192 \u201cI don\u2019t have an answer and I\u2019m hoping everyone forgets.\u201d Every buzzword decoded." },
            { title: "Dollar Cost", desc: "The meeting price tag in dollars. Every tangent, every buzzword, every wasted minute has a cost attached." },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                padding: "24px",
                borderTop: "1px solid #0A0A0A",
                borderRight: i % 3 < 2 ? "1px solid #D5D0CB" : "none",
              }}
            >
              <div className="font-sans text-ink" style={{ fontSize: 15, marginBottom: 8 }}>
                {feature.title}
              </div>
              <div className="font-mono text-muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #0A0A0A" }} />
      </section>

      {/* ── Sample numbers panel ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div
          className="flex items-center justify-between"
          style={{ backgroundColor: "#0A0A0A", padding: 40 }}
        >
          <div>
            <div
              className="font-mono text-muted"
              style={{ fontSize: 9, letterSpacing: "2px", marginBottom: 12, textTransform: "uppercase" }}
            >
              SAMPLE OUTPUT
            </div>
            <div className="flex items-end gap-8">
              <div>
                <DotMatrix value="86%" color="#FF6B6B" dotSize={8} gap={4} />
                <div className="font-mono text-muted" style={{ fontSize: 10, marginTop: 8, letterSpacing: "1px", textTransform: "uppercase" }}>
                  BS SCORE
                </div>
              </div>
              <div>
                <DotMatrix value="8" color="#F2C744" dotSize={8} gap={4} />
                <div className="font-mono text-muted" style={{ fontSize: 10, marginTop: 8, letterSpacing: "1px", textTransform: "uppercase" }}>
                  MIN OF WORK
                </div>
              </div>
              <div>
                <DotMatrix value="37" color="#FF6B6B" dotSize={8} gap={4} />
                <div className="font-mono text-muted" style={{ fontSize: 10, marginTop: 8, letterSpacing: "1px", textTransform: "uppercase" }}>
                  BUZZWORDS
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-sans text-parchment" style={{ fontSize: 20, marginBottom: 8 }}>
              Weekly Design Sync
            </div>
            <div className="font-mono text-muted" style={{ fontSize: 11 }}>
              57 min · 4 attendees · $4,218 total cost
            </div>
            <div className="font-mono" style={{ fontSize: 11, color: "#FF6B6B", marginTop: 4 }}>
              $3,612 wasted (86%)
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 80px" }}>
        <div
          className="border-2 border-ink text-center"
          style={{ padding: "60px 40px" }}
        >
          <h2
            className="font-sans text-ink"
            style={{ fontSize: 32, letterSpacing: "-1px", marginBottom: 12 }}
          >
            Ready to expose some yappers?
          </h2>
          <p
            className="font-mono text-muted"
            style={{ fontSize: 15, marginBottom: 28 }}
          >
            Upload your next meeting and find out what it really cost.
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="font-sans text-parchment bg-ink"
            style={{
              fontSize: 16,
              padding: "16px 40px",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.5px",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#D72638";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0A0A0A";
            }}
          >
            Upload Meeting
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="font-mono text-muted flex justify-between"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "20px 32px 40px",
          borderTop: "1px solid #D5D0CB",
          fontSize: 10,
          letterSpacing: "0.5px",
        }}
      >
        <span>MeetingBS</span>
        <span>Your time matters even if theirs doesn&apos;t.</span>
        <span>Built with spite</span>
      </footer>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
