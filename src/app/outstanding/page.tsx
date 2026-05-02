import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { clients, invoices } from "@/lib/mock-data";
import { fmtMoney, cn } from "@/lib/utils";
import { AlertTriangle, TrendingDown } from "lucide-react";

export default function OutstandingPage() {
  // Compute aging per client
  const agingByClient = clients
    .map((c) => {
      const cInvoices = invoices.filter((i) => i.clientName === c.name && i.balance > 0);
      const buckets = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
      for (const inv of cInvoices) {
        if (inv.agingBucket) {
          buckets[inv.agingBucket as keyof typeof buckets] += inv.balance;
        }
      }
      const total = Object.values(buckets).reduce((s, v) => s + v, 0);
      return { client: c, buckets, total };
    })
    .filter((row) => row.total > 0)
    .sort((a, b) => b.total - a.total);

  const totalOutstanding = agingByClient.reduce((s, r) => s + r.total, 0);
  const total90Plus = agingByClient.reduce((s, r) => s + r.buckets["90+"], 0);
  const total6090 = agingByClient.reduce((s, r) => s + r.buckets["61-90"], 0);

  return (
    <div>
      <PageHeader
        title="Outstanding"
        subtitle="클라이언트별 미수 + Aging Bucket + Risk Watchlist"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Outstanding" value={fmtMoney(totalOutstanding)} tone="warn" />
          <KpiCard label="Aging 61-90" value={fmtMoney(total6090)} tone="warn" />
          <KpiCard
            label="Aging 90+"
            value={fmtMoney(total90Plus)}
            tone="danger"
            hint="즉시 Finance Manager 알림"
          />
          <KpiCard label="Avg DSO" value="48d" trend="-4d" trendDir="down" tone="good" spark={[55, 53, 52, 50, 49, 48, 48]} />
        </div>

        {/* Aging Heatmap */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border-soft">
            <h2 className="text-sm font-semibold">Aging Heatmap</h2>
            <p className="text-[11px] text-fg-subtle mt-0.5">
              클라이언트 × Aging Bucket. 색이 진할수록 위험.
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border-soft">
              <tr className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <th className="text-left px-4 py-2.5 font-medium">Client</th>
                <th className="text-right px-3 py-2.5 font-medium">Total</th>
                <th className="text-right px-3 py-2.5 font-medium">0-30</th>
                <th className="text-right px-3 py-2.5 font-medium">31-60</th>
                <th className="text-right px-3 py-2.5 font-medium">61-90</th>
                <th className="text-right px-3 py-2.5 font-medium">90+</th>
                <th className="text-left px-3 py-2.5 font-medium">Risk</th>
                <th className="text-right px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {agingByClient.map((row) => {
                const has90 = row.buckets["90+"] > 0;
                const has60 = row.buckets["61-90"] > 0;
                return (
                  <tr key={row.client.id} className="table-row">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.client.name}</div>
                      <div className="text-[11px] text-fg-subtle">
                        {row.client.tier} · DSO {row.client.avgDso}d
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">
                      {fmtMoney(row.total, row.client.currency)}
                    </td>
                    <Cell amount={row.buckets["0-30"]} bucket="0-30" />
                    <Cell amount={row.buckets["31-60"]} bucket="31-60" />
                    <Cell amount={row.buckets["61-90"]} bucket="61-90" />
                    <Cell amount={row.buckets["90+"]} bucket="90+" />
                    <td className="px-3 py-3">
                      {has90 ? (
                        <span className="badge badge-crit text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> CRITICAL
                        </span>
                      ) : has60 ? (
                        <span className="badge badge-high text-[10px]">HIGH</span>
                      ) : (
                        <span className="badge badge-low text-[10px]">OK</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="btn btn-soft text-[11px]">
                        Bulk Dunning
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Risk Watchlist */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-risk-crit" />
            <h2 className="text-sm font-semibold">Risk Watchlist</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="border-l-2 border-l-risk-crit pl-3 py-1">
              <div className="font-medium">Phuket Beach Resort Co</div>
              <div className="text-fg-muted mt-0.5">
                Aging 61-90 $19.9K + 분쟁 1건. Utilization 92% 신규 부킹 hold 권장.
              </div>
            </div>
            <div className="border-l-2 border-l-risk-high pl-3 py-1">
              <div className="font-medium">Bali Sunrise DMC</div>
              <div className="text-fg-muted mt-0.5">
                Aging 0-30 $20K + DSO 71일로 악화 추세. AM 통화 권장.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cell({ amount, bucket }: { amount: number; bucket: string }) {
  const intensity = amount > 0 ? Math.min(amount / 20000, 1) : 0;
  const bgColor =
    bucket === "90+"
      ? `rgba(248, 81, 73, ${intensity * 0.6})`
      : bucket === "61-90"
      ? `rgba(219, 109, 40, ${intensity * 0.6})`
      : bucket === "31-60"
      ? `rgba(210, 153, 34, ${intensity * 0.6})`
      : `rgba(63, 185, 80, ${intensity * 0.4})`;
  return (
    <td className="px-3 py-3 text-right font-mono text-xs" style={{ backgroundColor: bgColor }}>
      {amount > 0 ? fmtMoney(amount) : "—"}
    </td>
  );
}
