import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({
  label,
  value,
  trend,
  trendDir,
  hint,
  tone = "neutral",
  spark,
  href,
}: {
  label: string;
  value: string | number;
  trend?: string;
  trendDir?: "up" | "down" | "neutral";
  hint?: string;
  tone?: "neutral" | "warn" | "danger" | "good";
  spark?: number[];
  href?: string;
}) {
  const toneClass =
    tone === "danger"
      ? "border-risk-crit/30 bg-risk-crit/5"
      : tone === "warn"
      ? "border-risk-med/30 bg-risk-med/5"
      : tone === "good"
      ? "border-risk-low/30 bg-risk-low/5"
      : "";

  const Wrapper: any = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "card card-hover p-4 flex flex-col gap-2 transition-colors",
        toneClass,
        href && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="text-[11px] text-fg-muted uppercase tracking-wider">{label}</div>
        {trend && (
          <div
            className={cn(
              "text-[10px] font-medium flex items-center gap-0.5",
              trendDir === "up"
                ? "text-risk-crit"
                : trendDir === "down"
                ? "text-risk-low"
                : "text-fg-subtle"
            )}
          >
            {trendDir === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : trendDir === "down" ? (
              <TrendingDown className="w-3 h-3" />
            ) : null}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {spark && spark.length > 0 && <Sparkline data={spark} tone={tone} />}
      {hint && <div className="text-[11px] text-fg-subtle">{hint}</div>}
    </Wrapper>
  );
}

function Sparkline({ data, tone }: { data: number[]; tone: "neutral" | "warn" | "danger" | "good" }) {
  const max = Math.max(...data, 1);
  const color =
    tone === "danger" ? "#f85149" : tone === "warn" ? "#d29922" : tone === "good" ? "#3fb950" : "#2f81f7";
  return (
    <div className="flex items-end gap-0.5 h-6">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${Math.max((v / max) * 100, 5)}%`,
            background: color,
            opacity: 0.3 + (v / max) * 0.7,
          }}
        />
      ))}
    </div>
  );
}
