import { useState } from "react";
import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "@remix-run/react";

import { mockMeeting } from "~/data/mock-meeting";

import { VerdictRow } from "~/components/dashboard/VerdictRow";
import { StatsTicker } from "~/components/dashboard/StatsTicker";
import { MetricsPanel } from "~/components/dashboard/MetricsPanel";
import { FilingTabs } from "~/components/dashboard/FilingTabs";
import type { TabId } from "~/components/dashboard/FilingTabs";
import { YappersTab } from "~/components/dashboard/YappersTab";
import { TangentsTab } from "~/components/dashboard/TangentsTab";
import { BuzzwordsTab } from "~/components/dashboard/BuzzwordsTab";
import { TrendsTab } from "~/components/dashboard/TrendsTab";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return [{ title: "MeetingBS" }];
  const { meeting } = data;
  return [
    { title: `${meeting.title} — MeetingBS` },
    { name: "description", content: meeting.verdict },
    { property: "og:title", content: `${meeting.title} — BS Score: ${meeting.bsScore}%` },
    { property: "og:description", content: meeting.verdict },
    { property: "og:type", content: "website" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  // TODO: Replace with real DB lookup once persistence is wired up.
  const meeting = mockMeeting;
  return json({ meeting, id });
}

export default function AnalyzeDashboard() {
  const { meeting } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<TabId>("yappers");

  return (
    <div
      className="min-h-screen overflow-x-hidden py-4 px-3 md:py-8 md:px-6"
      style={{ backgroundColor: "#EDE8E1" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ── Top navigation (outside the card) ── */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1
              style={{
                fontFamily: "PP Neue Montreal, Neue Montreal, Helvetica Neue, Arial, sans-serif",
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                color: "#0A0A0A",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              MeetingBS
            </h1>
          </Link>
          <Link
            to={`/receipt/${meeting.id}`}
            style={{
              fontFamily: "IBM Plex Mono, Courier New, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#0A0A0A",
              border: "2px solid #0A0A0A",
              padding: "6px 10px",
              textDecoration: "none",
              display: "inline-block",
              transition: "background-color 0.15s, color 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0A0A0A";
              (e.currentTarget as HTMLAnchorElement).style.color = "#EDE8E1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#0A0A0A";
            }}
          >
            VIEW RECEIPT →
          </Link>
        </div>

        {/* ── Main dashboard card ── */}
        <div
          style={{
            border: "2px solid #0A0A0A",
            boxShadow: "4px 4px 0 #0A0A0A",
          }}
          className="md:[box-shadow:8px_8px_0_#0A0A0A]"
        >
          {/* Verdict banner */}
          <VerdictRow verdict={meeting.verdict} />

          {/* Stats ticker */}
          <StatsTicker
            decisions={meeting.decisions}
            actionItems={meeting.actionItems}
            deferredItems={meeting.deferredItems}
          />

          {/* Metrics panel — black, dot-matrix numbers */}
          <MetricsPanel
            bsScore={meeting.bsScore}
            workMinutes={meeting.workMinutes}
            duration={meeting.duration}
            buzzwordCount={meeting.buzzwordCount}
            grade={meeting.grade}
          />

          {/* ── Filing cabinet tabs + content ── */}
          {/*
            The dark background extends behind the tabs so they bleed out of the MetricsPanel.
            The content area's borderTop is the single dividing line between tabs and content.
          */}
          <div style={{ position: "relative", backgroundColor: "#0A0A0A" }}>
            <FilingTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab content area — parchment background with ruled lines */}
            <div
              style={{
                borderTop: "2px solid #0A0A0A",
                backgroundColor: "#EDE8E1",
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 27px, #D5D0CB 27px, #D5D0CB 28px)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {activeTab === "yappers" && (
                <YappersTab
                  speakers={meeting.speakers}
                  duration={meeting.duration}
                  aiSummary={meeting.aiSummary}
                />
              )}
              {activeTab === "tangents" && <TangentsTab />}
              {activeTab === "buzzwords" && <BuzzwordsTab />}
              {activeTab === "trends" && <TrendsTab />}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p
            style={{
              fontFamily: "IBM Plex Mono, Courier New, monospace",
              fontSize: "0.65rem",
              color: "#999",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            MeetingBS — your time matters even if theirs doesn&apos;t
          </p>
        </footer>
      </div>
    </div>
  );
}
