import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { escalations } from "@/lib/mock-data";
import { fmtDuration, fmtRelative, cn } from "@/lib/utils";
import { Siren, CheckCircle2, RotateCw, Clock } from "lucide-react";

export default function EscalationsPage() {
  return (
    <div>
      <PageHeader
        title="Escalations"
        subtitle="에스컬레이션 받은 사용자가 ack/처리. CRITICAL 최상단."
      />

      <div className="p-6 space-y-3">
        {escalations.map((e) => {
          const bandClass =
            e.riskBand === "CRITICAL"
              ? "border-l-risk-crit bg-risk-crit/5"
              : e.riskBand === "HIGH"
              ? "border-l-risk-high bg-risk-high/5"
              : "border-l-risk-med bg-risk-med/5";
          const ackUrgent = e.ackDeadlineSec < 600;
          return (
            <div
              key={e.id}
              className={cn("card border-l-4 p-4 flex items-start gap-4", bandClass)}
            >
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-bg-soft">
                <Siren
                  className={cn(
                    "w-4 h-4",
                    e.riskBand === "CRITICAL" ? "text-risk-crit" : "text-risk-high"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      "badge text-[10px]",
                      e.riskBand === "CRITICAL" ? "badge-crit" : "badge-high"
                    )}
                  >
                    L{e.level}
                  </span>
                  <Link
                    href={`/cases/case_${e.caseCode === "CASE-2026-05-3987" ? "1" : e.caseCode === "CASE-2026-05-3986" ? "2" : "4"}`}
                    className="font-mono text-xs text-fg-muted hover:text-accent"
                  >
                    {e.caseCode}
                  </Link>
                  <span className="badge badge-neutral text-[10px] font-mono">
                    {e.reason}
                  </span>
                </div>
                <p className="text-sm text-fg leading-snug mb-2">{e.summary}</p>
                <div className="flex items-center gap-3 text-[11px] text-fg-muted">
                  <span>→ {e.recipientRole}</span>
                  <span>·</span>
                  <span>{fmtRelative(e.triggeredAt)}</span>
                  <span>·</span>
                  <span
                    className={cn(
                      "flex items-center gap-1 font-mono",
                      ackUrgent ? "text-risk-crit" : "text-fg-muted"
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    Ack in {fmtDuration(e.ackDeadlineSec)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button className="btn btn-primary text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Acknowledge
                </button>
                <button className="btn btn-soft text-[11px]">
                  <RotateCw className="w-3 h-3" /> Take Over
                </button>
                <button className="btn btn-ghost text-[11px]">Delegate</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
