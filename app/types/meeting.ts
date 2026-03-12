export interface MeetingAnalysis {
  id: string;
  title: string;
  date: string;
  duration: number; // minutes
  grade: string; // A through F
  verdict: string; // AI-generated one-liner

  // Time breakdown
  workMinutes: number;
  offTopicMinutes: number;
  couldBeMessageMinutes: number;

  // Outcomes
  decisions: number;
  actionItems: number;
  deferredItems: number;

  // Cost
  totalCost: number;
  wastedCost: number;

  // Scores
  bsScore: number; // 0-100 percentage
  buzzwordCount: number;
  buzzwordsPerMinute: number;

  // Participants
  speakers: Speaker[];

  // Timeline
  segments: TimelineSegment[];

  // Tangents
  tangents: Tangent[];

  // Buzzwords
  buzzwords: BuzzwordInstance[];

  // AI summary blurb (shown in right sidebar)
  aiSummary: string;

  // Sharing
  shareUrl?: string;

  // Source type — supports both upload and live stream (Phase 2)
  source: "upload" | "live";
  status: "processing" | "complete" | "error";
}

export interface Speaker {
  id: string;
  name: string;
  initials: string;
  color: string; // hex color for avatar background
  workMinutes: number;
  offTopicMinutes: number;
  couldBeMessageMinutes: number;
  buzzwordCount: number;
  actionItemsProduced: number;
  tangentsStarted: number;
  interruptions: number;
  bsRatio: number; // 0-100 percentage
  badge: SpeakerBadge;
  yapperScore: string; // e.g. "2847 words → 0 action items"
}

export type SpeakerBadge =
  | "TOP_YAPPER"
  | "MEETING_MVP"
  | "PIGGYBACKER"
  | "MEETING_ENTHUSIAST"
  | "HOSTAGE"
  | null;

export interface TimelineSegment {
  startMinute: number;
  endMinute: number;
  label: string;
  type: "work" | "offtopic" | "message";
  triggeredBy?: string;
}

export interface Tangent {
  timestamp: string;
  triggeredBy: string;
  triggerQuote: string;
  durationMinutes: number;
  category: string; // sports, travel, food, gossip, etc.
  costDollars: number;
}

export interface BuzzwordInstance {
  phrase: string;
  count: number;
  primarySpeaker: string;
  translation: string; // AI-generated contextual translation
}
