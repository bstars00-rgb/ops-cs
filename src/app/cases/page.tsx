import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { RiskBadge, PriorityBadge, StatusBadge, LangBadge } from "@/components/risk-badge";
import { SlaBar } from "@/components/sla-bar";
import { cases } from "@/lib/mock-data";
import { fmtRelative } from "@/lib/utils";
import { Filter, Plus, Download, Bookmark } from "lucide-react";

export default function CasesPage() {
  const sorted = [...cases].sort((a, b) => {
    const pa = ["P0", "P1", "P2", "P3"].indexOf(a.priority);
    const pb = ["P0", "P1", "P2", "P3"].indexOf(b.priority);
    if (pa !== pb) return pa - pb;
    return b.riskScore - a.riskScore;
  });

  return (
    <div>
      <PageHeader
        title="Cases"
        subtitle={`${cases.length}개 케이스 · risk → priority → SLA 정렬`}
        actions={
          <>
            <button className="btn btn-soft text-xs">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="btn btn-soft text-xs">
              <Bookmark className="w-3 h-3" /> Saved
            </button>
            <button className="btn btn-soft text-xs">
              <Download className="w-3 h-3" /> Export
            </button>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" /> New Case
            </button>
          </>
        }
      />

      <div className="px-6 pt-3">
        {/* Saved view tabs */}
        <div className="flex items-center gap-1 border-b border-border mb-3">
          {[
            { label: "All Open", count: 9, active: true },
            { label: "My Cases", count: 4 },
            { label: "Waiting Hotel", count: 3 },
            { label: "Urgent (P0)", count: 1, danger: true },
            { label: "SLA Breached", count: 3, danger: true },
            { label: "Resolved (7d)", count: 1 },
          ].map((t) => (
            <button
              key={t.label}
              className={`px-3 py-2 text-xs border-b-2 transition-colors ${
                t.active
                  ? "border-accent text-fg"
                  : "border-transparent text-fg-muted hover:text-fg"
              }`}
            >
              <span className={t.danger ? "text-risk-crit" : ""}>{t.label}</span>
              <span className="ml-1.5 text-fg-subtle">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <th className="text-left px-4 py-2.5 font-medium">Code</th>
                <th className="text-left px-3 py-2.5 font-medium">Type / Status</th>
                <th className="text-left px-3 py-2.5 font-medium">Subject</th>
                <th className="text-left px-3 py-2.5 font-medium">Client / Hotel</th>
                <th className="text-left px-3 py-2.5 font-medium">Priority</th>
                <th className="text-left px-3 py-2.5 font-medium">Risk</th>
                <th className="text-left px-3 py-2.5 font-medium">SLA</th>
                <th className="text-left px-3 py-2.5 font-medium">Owner</th>
                <th className="text-right px-4 py-2.5 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id} className="table-row">
                  <td className="px-4 py-3 font-mono text-xs text-fg-muted">
                    <Link href={`/cases/${c.id}`} className="hover:text-accent">
                      {c.code}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono text-fg-subtle">
                        {c.type.replace(/_/g, " ")}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                  </td>
                  <td className="px-3 py-3 max-w-[300px]">
                    <Link href={`/cases/${c.id}`}>
                      <div className="text-sm font-medium truncate hover:text-accent">
                        {c.subject}
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1">
                      <LangBadge lang={c.language} />
                      {c.bookingCode && (
                        <span className="text-[10px] font-mono text-fg-subtle">
                          {c.bookingCode}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    <div className="font-medium">{c.clientName}</div>
                    {c.hotelName && (
                      <div className="text-fg-muted text-[11px]">{c.hotelName}</div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="px-3 py-3">
                    <RiskBadge score={c.riskScore} />
                  </td>
                  <td className="px-3 py-3">
                    <SlaBar
                      remainingSec={c.slaRemainingSec}
                      totalSec={c.slaTotalSec}
                      compact
                    />
                  </td>
                  <td className="px-3 py-3 text-xs">{c.ownerName}</td>
                  <td className="px-4 py-3 text-right text-[11px] text-fg-subtle">
                    {fmtRelative(c.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
