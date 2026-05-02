import { cn, fmtDuration } from "@/lib/utils";

export function SlaBar({
  remainingSec,
  totalSec,
  compact = false,
}: {
  remainingSec: number;
  totalSec: number;
  compact?: boolean;
}) {
  const breached = remainingSec < 0;
  const pct = breached
    ? 100
    : Math.max(0, Math.min(100, ((totalSec - remainingSec) / totalSec) * 100));

  const color =
    breached || pct >= 100
      ? "bg-risk-crit"
      : pct >= 80
      ? "bg-risk-high"
      : pct >= 50
      ? "bg-risk-med"
      : "bg-risk-low";

  const label = breached
    ? `위반 ${fmtDuration(-remainingSec)} 경과`
    : `${fmtDuration(remainingSec)} 남음`;

  return (
    <div className={cn("flex items-center gap-2", compact ? "min-w-[80px]" : "min-w-[140px]")}>
      <div className="flex-1 h-1.5 bg-bg-soft rounded-full overflow-hidden">
        <div className={cn("h-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span
        className={cn(
          "text-[10px] font-mono whitespace-nowrap",
          breached ? "text-risk-crit" : "text-fg-muted"
        )}
      >
        {label}
      </span>
    </div>
  );
}
