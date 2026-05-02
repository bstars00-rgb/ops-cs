import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { invoices } from "@/lib/mock-data";
import { fmtMoney, cn } from "@/lib/utils";
import { Plus, Filter, Download } from "lucide-react";

export default function BillingPage() {
  const total = invoices.reduce((s, i) => s + i.amount, 0);
  const balance = invoices.reduce((s, i) => s + i.balance, 0);
  const overdue = invoices.filter((i) => i.daysToDue < 0).reduce((s, i) => s + i.balance, 0);

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle="청구서 라이프사이클 + Aging + AI Dunning"
        actions={
          <>
            <button className="btn btn-soft text-xs">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="btn btn-soft text-xs">
              <Download className="w-3 h-3" /> ERP Export
            </button>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" /> New Invoice
            </button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Invoiced" value={fmtMoney(total)} />
          <KpiCard label="Outstanding" value={fmtMoney(balance)} tone="warn" />
          <KpiCard label="Overdue" value={fmtMoney(overdue)} tone="danger" trend="+8%" trendDir="up" />
          <KpiCard label="DSO Avg" value="42d" tone="warn" trend="-3d" trendDir="down" />
        </div>

        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between">
            <h2 className="text-sm font-semibold">Invoices</h2>
            <div className="flex items-center gap-1 text-xs">
              {["All", "Sent", "Partial", "Paid", "Disputed"].map((t, i) => (
                <button
                  key={t}
                  className={cn(
                    "px-2 py-1 rounded transition-colors",
                    i === 0 ? "bg-bg-hover text-fg" : "text-fg-muted hover:bg-bg-hover"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border-soft">
              <tr className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <th className="text-left px-4 py-2.5 font-medium">Code</th>
                <th className="text-left px-3 py-2.5 font-medium">Client</th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="text-right px-3 py-2.5 font-medium">Amount</th>
                <th className="text-right px-3 py-2.5 font-medium">Paid</th>
                <th className="text-right px-3 py-2.5 font-medium">Balance</th>
                <th className="text-left px-3 py-2.5 font-medium">Due</th>
                <th className="text-left px-3 py-2.5 font-medium">Aging</th>
                <th className="text-right px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const overdueDays = inv.daysToDue < 0 ? -inv.daysToDue : 0;
                const statusBadge =
                  inv.status === "PAID"
                    ? "badge-low"
                    : inv.status === "PARTIAL"
                    ? "badge-med"
                    : inv.status === "DISPUTED"
                    ? "badge-crit"
                    : inv.status === "VOID"
                    ? "badge-neutral"
                    : "badge-accent";
                const agingBadge =
                  inv.agingBucket === "90+"
                    ? "badge-crit"
                    : inv.agingBucket === "61-90"
                    ? "badge-high"
                    : inv.agingBucket === "31-60"
                    ? "badge-med"
                    : inv.agingBucket === "0-30"
                    ? "badge-low"
                    : "badge-neutral";
                return (
                  <tr key={inv.id} className="table-row">
                    <td className="px-4 py-3 font-mono text-xs text-fg-muted">{inv.code}</td>
                    <td className="px-3 py-3">{inv.clientName}</td>
                    <td className="px-3 py-3">
                      <span className={cn("badge text-[10px] font-mono", statusBadge)}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {fmtMoney(inv.amount, inv.currency)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-fg-muted">
                      {fmtMoney(inv.paid, inv.currency)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-medium">
                      {fmtMoney(inv.balance, inv.currency)}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <div>{inv.dueDate}</div>
                      {inv.daysToDue < 0 ? (
                        <div className="text-risk-crit">D+{overdueDays}</div>
                      ) : (
                        <div className="text-fg-muted">D-{inv.daysToDue}</div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("badge text-[10px]", agingBadge)}>
                        {inv.agingBucket || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn btn-soft text-[11px]">
                        AI Dunning
                      </button>
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
