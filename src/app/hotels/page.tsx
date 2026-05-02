import { PageHeader } from "@/components/page-header";
import { hotels } from "@/lib/mock-data";
import { fmtDuration, fmtRelative } from "@/lib/utils";
import { Plus, Filter, Download, CheckCircle2, XCircle } from "lucide-react";

export default function HotelsPage() {
  return (
    <div>
      <PageHeader
        title="Hotels & Suppliers"
        subtitle={`${hotels.length}개 호텔 · 응답률 30d / 평균 응답시간 / SLA 자동 학습`}
        actions={
          <>
            <button className="btn btn-soft text-xs">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="btn btn-soft text-xs">
              <Download className="w-3 h-3" /> Export
            </button>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" /> Register Hotel
            </button>
          </>
        }
      />

      <div className="p-6">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <th className="text-left px-4 py-2.5 font-medium">Code</th>
                <th className="text-left px-3 py-2.5 font-medium">Name</th>
                <th className="text-left px-3 py-2.5 font-medium">Country</th>
                <th className="text-left px-3 py-2.5 font-medium">Lang</th>
                <th className="text-left px-3 py-2.5 font-medium">Response Rate 30d</th>
                <th className="text-left px-3 py-2.5 font-medium">Avg Response</th>
                <th className="text-left px-3 py-2.5 font-medium">SLA</th>
                <th className="text-left px-3 py-2.5 font-medium">Auto-Send</th>
                <th className="text-left px-3 py-2.5 font-medium">Contacts</th>
                <th className="text-right px-4 py-2.5 font-medium">Last Contact</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h) => {
                const slaStatus = h.avgResponseSec > h.slaResponseSec ? "warn" : "ok";
                return (
                  <tr key={h.id} className="table-row">
                    <td className="px-4 py-3 font-mono text-xs text-fg-muted">{h.code}</td>
                    <td className="px-3 py-3 font-medium">{h.name}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className="badge badge-neutral">{h.country}</span>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className="badge badge-neutral uppercase font-mono">{h.language}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-bg-soft rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              h.responseRate30d >= 0.85
                                ? "bg-risk-low"
                                : h.responseRate30d >= 0.7
                                ? "bg-risk-med"
                                : "bg-risk-high"
                            }`}
                            style={{ width: `${h.responseRate30d * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-fg-muted">
                          {Math.round(h.responseRate30d * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className={slaStatus === "warn" ? "text-risk-med" : "text-fg"}>
                        {fmtDuration(h.avgResponseSec)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-fg-muted">
                      {fmtDuration(h.slaResponseSec)}
                    </td>
                    <td className="px-3 py-3">
                      {h.autoSendAllowed ? (
                        <span className="text-xs text-risk-low flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Allowed
                        </span>
                      ) : (
                        <span className="text-xs text-fg-subtle flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-fg-muted">{h.contactsCount}</td>
                    <td className="px-4 py-3 text-right text-[11px] text-fg-subtle">
                      {h.lastContactedAt ? fmtRelative(h.lastContactedAt) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
