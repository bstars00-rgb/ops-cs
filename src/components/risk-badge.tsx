import { cn, riskBand } from "@/lib/utils";

export function RiskBadge({ score, withScore = true }: { score: number; withScore?: boolean }) {
  const band = riskBand(score);
  const cls =
    band === "CRITICAL"
      ? "badge-crit"
      : band === "HIGH"
      ? "badge-high"
      : band === "MEDIUM"
      ? "badge-med"
      : "badge-low";
  return (
    <span className={cn("badge", cls)}>
      <span className="font-mono">{band}</span>
      {withScore && <span className="opacity-70">{score}</span>}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "P0" | "P1" | "P2" | "P3" }) {
  const cls =
    priority === "P0"
      ? "badge-crit"
      : priority === "P1"
      ? "badge-high"
      : priority === "P2"
      ? "badge-med"
      : "badge-neutral";
  return <span className={cn("badge", cls)}>{priority}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const isTerminal = ["RESOLVED", "CLOSED", "FAILED_UNRESOLVED"].includes(status);
  const isWaiting = status.startsWith("WAITING") || status.includes("CHASE");
  const isEscalated = status.startsWith("ESCALATED");
  const isOverdue = status.startsWith("OVERDUE");
  const cls = isEscalated
    ? "badge-crit"
    : isOverdue
    ? "badge-high"
    : isTerminal
    ? "badge-low"
    : isWaiting
    ? "badge-med"
    : "badge-neutral";
  return (
    <span className={cn("badge", cls)}>
      <span className="font-mono text-[10px]">{status.replace(/_/g, " ")}</span>
    </span>
  );
}

export function LangBadge({ lang }: { lang: string }) {
  return (
    <span className="badge badge-neutral uppercase font-mono text-[10px]">
      {lang}
    </span>
  );
}
