interface StatsTickerProps {
  decisions: number;
  actionItems: number;
  deferredItems: number;
}

export function StatsTicker({ decisions, actionItems, deferredItems }: StatsTickerProps) {
  const stats = [
    { label: "DECISIONS", value: decisions },
    { label: "ACTION ITEMS", value: actionItems },
    { label: "DEFERRED", value: deferredItems },
  ];

  return (
    <div className="flex flex-col md:flex-row border-x-2 border-b-2 border-ink" style={{ backgroundColor: "#EDE8E1" }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex items-center justify-between flex-1 px-3 py-2 md:py-1.5"
          style={{
            borderBottom: i < stats.length - 1 ? "1px solid #D5D0CB" : "none",
          }}
        >
          <span className="font-mono text-[10px] font-bold tracking-widest text-ink uppercase">
            {stat.label}
          </span>
          <span
            className="font-mono text-sm font-bold text-ink"
            style={{
              backgroundColor: "#D5D0CB",
              padding: "1px 8px",
              border: "1px solid #999",
            }}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
