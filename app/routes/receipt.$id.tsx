import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { mockMeeting } from "~/data/mock-meeting";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "Meeting Receipt — MeetingBS" }];
  const { meeting } = data;
  return [
    { title: `Meeting Receipt: ${meeting.title} — MeetingBS` },
    { name: "description", content: `BS Score: ${meeting.bsScore}% | ${meeting.verdict}` },
    { property: "og:title", content: `Meeting Receipt: ${meeting.title}` },
    { property: "og:description", content: `${meeting.verdict} BS Score: ${meeting.bsScore}%. Wasted cost: $${meeting.wastedCost.toLocaleString()}.` },
    { property: "og:type", content: "website" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  // TODO: Replace with real DB lookup
  const meeting = mockMeeting;
  return json({ meeting, id });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCost(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BADGE_LABELS: Record<string, string> = {
  TOP_YAPPER: "TOP YAPPER",
  MEETING_MVP: "MEETING MVP",
  PIGGYBACKER: "PIGGYBACKER",
  MEETING_ENTHUSIAST: "ENTHUSIAST",
  HOSTAGE: "HOSTAGE",
};

const BADGE_COLORS: Record<string, string> = {
  TOP_YAPPER: "#D72638",
  MEETING_MVP: "#22C55E",
  PIGGYBACKER: "#F59E0B",
  MEETING_ENTHUSIAST: "#FF6B6B",
  HOSTAGE: "#4A4A4A",
};

// ── Separator ─────────────────────────────────────────────────────────────────

function Separator({ style = "dots" }: { style?: "dots" | "solid" | "double" }) {
  if (style === "solid") {
    return <div style={{ borderTop: "2px solid #0A0A0A", margin: "0" }} />;
  }
  if (style === "double") {
    return (
      <div>
        <div style={{ borderTop: "2px solid #0A0A0A" }} />
        <div style={{ borderTop: "2px solid #0A0A0A", marginTop: 3 }} />
      </div>
    );
  }
  return (
    <p
      className="font-mono text-[11px] text-center"
      style={{ color: "#999", letterSpacing: "0.15em", padding: "4px 0" }}
    >
      {"· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·"}
    </p>
  );
}

// ── Receipt Line ──────────────────────────────────────────────────────────────

function ReceiptLine({
  label,
  value,
  bold = false,
  accent = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-baseline gap-2 py-0.5">
      <span
        className="font-mono text-[11px] tracking-wide uppercase"
        style={{ color: accent ? "#D72638" : "#0A0A0A", flexShrink: 0 }}
      >
        {label}
      </span>
      <span
        className="font-mono text-[11px] tracking-widest"
        style={{
          color: accent ? "#D72638" : "#0A0A0A",
          fontWeight: bold ? 700 : 400,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ReceiptPage() {
  const { meeting } = useLoaderData<typeof loader>();

  const workPct = Math.round((meeting.workMinutes / meeting.duration) * 100);
  const offTopicPct = Math.round((meeting.offTopicMinutes / meeting.duration) * 100);
  const messagePct = Math.round((meeting.couldBeMessageMinutes / meeting.duration) * 100);

  const topTangent = [...(meeting.tangents ?? [])].sort(
    (a, b) => b.costDollars - a.costDollars
  )[0];

  const topYapper = meeting.speakers.find((s) => s.badge === "TOP_YAPPER");

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: `Meeting Receipt: ${meeting.title}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: "#EDE8E1" }}
    >
      {/* ── Receipt card ── */}
      <div
        className="mx-auto"
        style={{
          maxWidth: 480,
          border: "2px solid #0A0A0A",
          boxShadow: "6px 6px 0 #0A0A0A",
          backgroundColor: "#EDE8E1",
        }}
      >

        {/* ── Header ── */}
        <div
          className="px-6 pt-6 pb-4 text-center"
          style={{ borderBottom: "2px solid #0A0A0A" }}
        >
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted mb-1">
            MeetingBS™
          </p>
          <h1
            className="font-mono font-bold tracking-tight"
            style={{ fontSize: "1.6rem", color: "#0A0A0A", lineHeight: 1 }}
          >
            MEETING RECEIPT
          </h1>
          <p className="font-mono text-[10px] text-muted mt-2 tracking-widest">
            {meeting.date.toUpperCase()} · {meeting.duration} MIN
          </p>
          <p className="font-mono text-[10px] text-muted tracking-widest">
            REF: {meeting.id.toUpperCase()}
          </p>
        </div>

        {/* ── Meeting title + verdict ── */}
        <div className="px-6 py-4" style={{ borderBottom: "2px solid #0A0A0A" }}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-1">
            MEETING
          </p>
          <p className="font-sans text-base text-ink leading-snug mb-3">
            {meeting.title}
          </p>
          <Separator style="dots" />
          <p
            className="font-mono text-[11px] text-center leading-relaxed mt-2"
            style={{ color: "#4A4A4A", fontStyle: "italic" }}
          >
            &ldquo;{meeting.verdict}&rdquo;
          </p>
        </div>

        {/* ── Grade + BS Score ── */}
        <div
          className="flex"
          style={{ borderBottom: "2px solid #0A0A0A" }}
        >
          {/* Grade */}
          <div
            className="flex-1 flex flex-col items-center justify-center py-5"
            style={{ borderRight: "2px solid #0A0A0A", backgroundColor: "#0A0A0A" }}
          >
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: "#666" }}>
              GRADE
            </p>
            <span
              className="font-mono font-bold"
              style={{ fontSize: "4rem", lineHeight: 1, color: "#D72638" }}
            >
              {meeting.grade}
            </span>
          </div>

          {/* BS Score */}
          <div
            className="flex-1 flex flex-col items-center justify-center py-5"
            style={{ backgroundColor: "#0A0A0A" }}
          >
            <p className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: "#666" }}>
              BS SCORE
            </p>
            <span
              className="font-mono font-bold"
              style={{ fontSize: "4rem", lineHeight: 1, color: "#F2C744" }}
            >
              {meeting.bsScore}%
            </span>
          </div>
        </div>

        {/* ── Cost breakdown ── */}
        <div className="px-6 py-4" style={{ borderBottom: "2px solid #0A0A0A" }}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3">
            COST BREAKDOWN
          </p>
          <ReceiptLine label="TOTAL COST" value={formatCost(meeting.totalCost)} bold />
          <ReceiptLine label="WASTED COST" value={formatCost(meeting.wastedCost)} bold accent />
          <Separator style="dots" />
          <ReceiptLine label="DECISIONS MADE" value={String(meeting.decisions)} />
          <ReceiptLine label="ACTION ITEMS" value={String(meeting.actionItems)} />
          <ReceiptLine label="DEFERRED ITEMS" value={String(meeting.deferredItems)} />
          <ReceiptLine label="BUZZWORDS USED" value={String(meeting.buzzwordCount)} />
        </div>

        {/* ── Time breakdown ── */}
        <div className="px-6 py-4" style={{ borderBottom: "2px solid #0A0A0A" }}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3">
            TIME BREAKDOWN
          </p>

          {/* Bar */}
          <div className="flex h-4 mb-3" style={{ border: "1px solid #0A0A0A" }}>
            <div style={{ width: `${workPct}%`, backgroundColor: "#22C55E" }} />
            <div style={{ width: `${offTopicPct}%`, backgroundColor: "#D72638" }} />
            <div style={{ width: `${messagePct}%`, backgroundColor: "#C8C3BC" }} />
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <div style={{ width: 8, height: 8, backgroundColor: "#22C55E", flexShrink: 0 }} />
              <span className="font-mono text-[10px] text-ink">WORK {meeting.workMinutes}m ({workPct}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div style={{ width: 8, height: 8, backgroundColor: "#D72638", flexShrink: 0 }} />
              <span className="font-mono text-[10px] text-ink">OFF-TOPIC {meeting.offTopicMinutes}m ({offTopicPct}%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div style={{ width: 8, height: 8, backgroundColor: "#C8C3BC", flexShrink: 0 }} />
              <span className="font-mono text-[10px] text-ink">COULD-BE-MSG {meeting.couldBeMessageMinutes}m ({messagePct}%)</span>
            </div>
          </div>
        </div>

        {/* ── Yapper rankings ── */}
        <div className="px-6 py-4" style={{ borderBottom: "2px solid #0A0A0A" }}>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3">
            YAPPER RANKINGS
          </p>
          {meeting.speakers.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3 py-1.5" style={{ borderBottom: i < meeting.speakers.length - 1 ? "1px solid #D5D0CB" : "none" }}>
              <span className="font-mono text-[10px] text-muted w-4 flex-shrink-0">
                {i + 1}.
              </span>
              <div
                className="flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0"
                style={{ width: 28, height: 28, backgroundColor: s.color, color: "#EDE8E1", border: "1px solid #0A0A0A" }}
              >
                {s.initials}
              </div>
              <span className="font-sans text-xs text-ink flex-1">{s.name}</span>
              {s.badge && (
                <span
                  className="font-mono text-[8px] tracking-widest px-1 py-0.5"
                  style={{ backgroundColor: BADGE_COLORS[s.badge] ?? "#999", color: "#EDE8E1" }}
                >
                  {BADGE_LABELS[s.badge] ?? s.badge}
                </span>
              )}
              <span
                className="font-mono text-[11px] font-bold flex-shrink-0"
                style={{ color: s.bsRatio >= 85 ? "#D72638" : s.bsRatio >= 75 ? "#FF6B6B" : "#22C55E" }}
              >
                {s.bsRatio}%
              </span>
            </div>
          ))}
        </div>

        {/* ── Top tangent ── */}
        {topTangent && (
          <div className="px-6 py-4" style={{ borderBottom: "2px solid #0A0A0A" }}>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-2">
              MOST EXPENSIVE TANGENT
            </p>
            <div
              className="p-3"
              style={{ backgroundColor: "#0A0A0A" }}
            >
              <p className="font-mono text-[10px] text-muted mb-1 tracking-widest uppercase">
                {topTangent.triggeredBy} · {topTangent.durationMinutes} MIN · {formatCost(topTangent.costDollars)}
              </p>
              <p className="font-sans text-sm" style={{ color: "#EDE8E1" }}>
                &ldquo;{topTangent.triggerQuote}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* ── Top yapper quote ── */}
        {topYapper && (
          <div className="px-6 py-4" style={{ borderBottom: "2px solid #0A0A0A" }}>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-2">
              TOP YAPPER
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center font-mono font-bold text-sm flex-shrink-0"
                style={{ width: 40, height: 40, backgroundColor: topYapper.color, color: "#EDE8E1", border: "2px solid #0A0A0A" }}
              >
                {topYapper.initials}
              </div>
              <div>
                <p className="font-sans text-sm text-ink">{topYapper.name}</p>
                <p className="font-mono text-[10px] text-muted">{topYapper.yapperScore}</p>
              </div>
              <span
                className="font-mono font-bold text-lg ml-auto"
                style={{ color: "#D72638" }}
              >
                {topYapper.bsRatio}%
              </span>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-6 py-5 text-center" style={{ borderBottom: "2px solid #0A0A0A" }}>
          <Separator style="double" />
          <p
            className="font-mono text-[10px] tracking-[0.2em] uppercase mt-4 mb-1"
            style={{ color: "#0A0A0A" }}
          >
            YOUR TIME MATTERS
          </p>
          <p
            className="font-mono text-[10px] tracking-[0.2em] uppercase mb-4"
            style={{ color: "#0A0A0A" }}
          >
            EVEN IF THEIRS DOESN&apos;T
          </p>
          <p className="font-mono text-[9px] text-muted tracking-widest">
            meetingbs.com · {new Date().getFullYear()}
          </p>
        </div>

        {/* ── Actions ── */}
        <div
          className="px-6 py-4 flex gap-3 flex-wrap"
          style={{ backgroundColor: "#EDE8E1" }}
        >
          <button
            onClick={handleShare}
            className="font-mono text-[11px] tracking-widest uppercase px-4 py-2 flex-1"
            style={{
              backgroundColor: "#0A0A0A",
              color: "#EDE8E1",
              border: "2px solid #0A0A0A",
              cursor: "pointer",
            }}
          >
            SHARE RECEIPT
          </button>
          <Link
            to={`/analyze/${meeting.id}`}
            className="font-mono text-[11px] tracking-widest uppercase px-4 py-2 flex-1 text-center"
            style={{
              backgroundColor: "transparent",
              color: "#0A0A0A",
              border: "2px solid #0A0A0A",
              textDecoration: "none",
            }}
          >
            ← FULL REPORT
          </Link>
        </div>
      </div>

      {/* Outside card footer */}
      <p
        className="text-center font-mono text-[9px] text-muted mt-6 tracking-widest uppercase"
      >
        MeetingBS — Powered by AI, fueled by corporate suffering
      </p>
    </div>
  );
}
