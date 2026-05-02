import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { RiskBadge, PriorityBadge, LangBadge } from "@/components/risk-badge";
import { SlaBar } from "@/components/sla-bar";
import { cases, escalations, approvals } from "@/lib/mock-data";
import { fmtRelative, fmtDuration } from "@/lib/utils";
import { ArrowRight, Sparkles, Activity, Bot } from "lucide-react";

export default function DashboardPage() {
  const open = cases.filter((c) => !["RESOLVED", "CLOSED"].includes(c.status));
  const waitingHotel = cases.filter((c) => c.status === "WAITING_FOR_HOTEL");
  const slaBreached = cases.filter((c) => c.slaRemainingSec < 0 && !["RESOLVED", "CLOSED"].includes(c.status));
  const urgent = cases.filter((c) => c.type === "URGENT_CHECKIN_ISSUE" && !["RESOLVED", "CLOSED"].includes(c.status));

  const top5 = [...open]
    .sort((a, b) => {
      const pa = ["P0", "P1", "P2", "P3"].indexOf(a.priority);
      const pb = ["P0", "P1", "P2", "P3"].indexOf(b.priority);
      if (pa !== pb) return pa - pb;
      return b.riskScore - a.riskScore;
    })
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="OPS · 오늘 처리해야 할 항목 5초 내 파악"
        actions={
          <>
            <button className="btn btn-soft text-xs">Today</button>
            <button className="btn btn-primary text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Start my day
            </button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard
            label="Total Open Cases"
            value={open.length}
            trend="+12%"
            trendDir="up"
            spark={[24, 28, 32, 30, 36, 41, 47]}
          />
          <KpiCard
            label="New Today"
            value={6}
            trend="+50%"
            trendDir="up"
            tone="warn"
            spark={[3, 4, 2, 5, 4, 6, 6]}
          />
          <KpiCard
            label="Waiting for Hotel"
            value={waitingHotel.length}
            hint={`SLA breached: ${slaBreached.length}`}
            tone={slaBreached.length > 0 ? "danger" : "neutral"}
            spark={[18, 21, 19, 22, 20, 23, 22]}
          />
          <KpiCard
            label="Urgent Check-in"
            value={urgent.length}
            hint={urgent.length > 0 ? "5분 SLA 활성" : "정상"}
            tone={urgent.length > 0 ? "danger" : "good"}
          />
          <KpiCard
            label="Payment Overdue"
            value="$58.4K"
            trend="-8%"
            trendDir="down"
            tone="warn"
            hint="Aging 31-60: $28.1K"
            href="/outstanding"
          />
          <KpiCard
            label="Credit Limit Warning"
            value={2}
            tone="warn"
            hint="Phuket Beach Resort 92%"
            href="/credit"
          />
          <KpiCard
            label="Avg Resolution (7d)"
            value="14h 22m"
            trend="-22%"
            trendDir="down"
            tone="good"
            spark={[18, 16, 17, 15, 14, 14, 14]}
          />
          <KpiCard
            label="AI Draft Acceptance"
            value="78%"
            trend="+5%"
            trendDir="up"
            tone="good"
            spark={[68, 70, 72, 71, 74, 76, 78]}
          />
        </div>

        {/* Two-column: Priority Queue + AI Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Priority Queue */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-accent" />
                    Priority Queue
                  </h2>
                  <p className="text-[11px] text-fg-subtle mt-0.5">
                    risk → priority → SLA 자동 정렬. 내가 owner인 케이스 우선.
                  </p>
                </div>
                <Link href="/cases" className="text-xs text-accent hover:underline flex items-center gap-1">
                  All cases <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-border-soft">
                {top5.map((c) => (
                  <Link
                    key={c.id}
                    href={`/cases/${c.id}`}
                    className="px-4 py-3 hover:bg-bg-hover flex items-center gap-3 transition-colors"
                  >
                    <div className="flex flex-col items-start gap-1 w-[72px] shrink-0">
                      <PriorityBadge priority={c.priority} />
                      <RiskBadge score={c.riskScore} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-fg-subtle">{c.code}</span>
                        <LangBadge lang={c.language} />
                      </div>
                      <div className="text-sm font-medium truncate mt-0.5">{c.subject}</div>
                      <div className="text-[11px] text-fg-muted truncate mt-0.5">
                        {c.clientName}
                        {c.hotelName && <> · {c.hotelName}</>}
                        {c.bookingCode && <> · {c.bookingCode}</>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <SlaBar remainingSec={c.slaRemainingSec} totalSec={c.slaTotalSec} compact />
                      <span className="text-[10px] text-fg-subtle">{fmtRelative(c.updatedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* AI Activity */}
          <div className="space-y-6">
            {/* Active Escalations */}
            <div className="card">
              <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between">
                <h2 className="text-sm font-semibold">Active Escalations</h2>
                <Link href="/escalations" className="text-xs text-accent hover:underline">
                  View →
                </Link>
              </div>
              <div className="divide-y divide-border-soft">
                {escalations.slice(0, 3).map((e) => (
                  <div key={e.id} className="px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-mono text-fg-subtle">{e.caseCode}</span>
                      <span
                        className={`badge ${
                          e.riskBand === "CRITICAL"
                            ? "badge-crit"
                            : e.riskBand === "HIGH"
                            ? "badge-high"
                            : "badge-med"
                        }`}
                      >
                        L{e.level}
                      </span>
                    </div>
                    <div className="text-xs text-fg leading-snug">{e.summary}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-fg-subtle">{e.recipientRole}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          e.ackDeadlineSec < 600 ? "text-risk-crit" : "text-fg-muted"
                        }`}
                      >
                        Ack {fmtDuration(e.ackDeadlineSec)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Queue */}
            <div className="card">
              <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between">
                <h2 className="text-sm font-semibold flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-accent" />
                  Approval Queue
                </h2>
                <Link href="/approvals" className="text-xs text-accent hover:underline">
                  View {approvals.length} →
                </Link>
              </div>
              <div className="divide-y divide-border-soft">
                {approvals.slice(0, 3).map((a) => (
                  <div key={a.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-accent text-[10px]">{a.kind}</span>
                      <span
                        className={`badge text-[10px] ${
                          a.riskBand === "CRITICAL"
                            ? "badge-crit"
                            : a.riskBand === "HIGH"
                            ? "badge-high"
                            : a.riskBand === "MEDIUM"
                            ? "badge-med"
                            : "badge-low"
                        }`}
                      >
                        {a.riskBand}
                      </span>
                    </div>
                    <div className="text-xs font-medium leading-snug">{a.subject}</div>
                    <div className="text-[10px] text-fg-subtle mt-1">
                      by {a.requesterName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
