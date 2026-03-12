import { Link } from "@remix-run/react";

interface DashboardHeaderProps {
  title: string;
  date: string;
  meetingId: string;
}

export function DashboardHeader({ title, date, meetingId }: DashboardHeaderProps) {
  return (
    <header className="flex items-start justify-between mb-0 px-0 pt-6 pb-4">
      <div>
        <Link to="/" className="block">
          <h1 className="font-sans font-black text-4xl text-ink tracking-tight leading-none">
            MeetingBS
          </h1>
        </Link>
        <p className="font-mono text-xs text-muted mt-1 tracking-wide uppercase">
          {title} &middot; {date}
        </p>
      </div>
      <Link
        to={`/receipt/${meetingId}`}
        className="font-mono text-xs font-bold tracking-widest uppercase px-4 py-2 border-2 border-ink text-ink hover:bg-ink hover:text-parchment transition-colors duration-150"
      >
        VIEW RECEIPT →
      </Link>
    </header>
  );
}
