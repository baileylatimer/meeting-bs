interface VerdictRowProps {
  verdict: string;
}

export function VerdictRow({ verdict }: VerdictRowProps) {
  return (
    <div
      className="flex items-center px-4 py-4 md:px-6 md:py-5"
      style={{ backgroundColor: "#FF6B6B", borderBottom: "2px solid #0A0A0A" }}
    >
      <p className="font-sans text-base md:text-xl text-ink leading-snug">
        {verdict}
      </p>
    </div>
  );
}
