import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { approvals } from "@/lib/mock-data";
import { fmtDuration, cn } from "@/lib/utils";
import { CheckCircle2, X, Edit3, Bot, Clock } from "lucide-react";

export default function ApprovalsPage() {
  return (
    <div>
      <PageHeader
        title="Approval Queue"
        subtitle="AI 드래프트 + 결재 요청 통합. CRITICAL 우선 정렬."
      />

      <div className="p-6 space-y-3">
        {approvals.map((a) => {
          const bandClass =
            a.riskBand === "CRITICAL"
              ? "border-l-risk-crit"
              : a.riskBand === "HIGH"
              ? "border-l-risk-high"
              : a.riskBand === "MEDIUM"
              ? "border-l-risk-med"
              : "border-l-risk-low";
          const isAI = a.requesterName.includes("AI");
          return (
            <div key={a.id} className={cn("card border-l-4 p-4", bandClass)}>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-bg-soft">
                  {isAI ? (
                    <Bot className="w-4 h-4 text-accent" />
                  ) : (
                    <Edit3 className="w-4 h-4 text-fg-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-accent text-[10px]">{a.kind}</span>
                    <span
                      className={cn(
                        "badge text-[10px]",
                        a.riskBand === "CRITICAL"
                          ? "badge-crit"
                          : a.riskBand === "HIGH"
                          ? "badge-high"
                          : a.riskBand === "MEDIUM"
                          ? "badge-med"
                          : "badge-low"
                      )}
                    >
                      {a.riskBand}
                    </span>
                    {a.caseCode && (
                      <Link
                        href={`/cases/case_1`}
                        className="text-xs font-mono text-fg-muted hover:text-accent"
                      >
                        {a.caseCode}
                      </Link>
                    )}
                  </div>
                  <h3 className="text-sm font-medium mb-1">{a.subject}</h3>
                  <p className="text-[11px] text-fg-muted leading-relaxed mb-2">
                    {a.aiRecommendation}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-fg-subtle">
                    <span>by {a.requesterName}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {fmtDuration(a.deadlineSec)} 남음
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button className="btn btn-primary text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> Approve & Send
                  </button>
                  <button className="btn btn-soft text-[11px]">
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button className="btn btn-ghost text-[11px] text-risk-crit">
                    <X className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
