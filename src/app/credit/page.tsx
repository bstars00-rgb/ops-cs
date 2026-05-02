import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { clients } from "@/lib/mock-data";
import { fmtMoney, cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

export default function CreditPage() {
  const warning = clients.filter((c) => c.utilizationPct >= 0.8 && c.utilizationPct < 1.0);
  const critical = clients.filter((c) => c.utilizationPct >= 1.0);
  const okClients = clients.filter((c) => c.utilizationPct < 0.8);
  const totalLimit = clients.reduce((s, c) => s + c.creditLimit, 0);
  const totalExposure = clients.reduce((s, c) => s + c.outstanding + c.pipeline, 0);

  return (
    <div>
      <PageHeader
        title="Credit Control"
        subtitle="신용 한도 ↔ 부킹 실시간 연동 · utilization ≥80% 경고 / ≥100% 자동 hold"
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Total Credit Limit" value={fmtMoney(totalLimit)} />
          <KpiCard
            label="Total Exposure"
            value={fmtMoney(totalExposure)}
            tone="warn"
            hint={`Utilization ${Math.round((totalExposure / totalLimit) * 100)}%`}
          />
          <KpiCard label="Warning (80-99%)" value={warning.length} tone="warn" />
          <KpiCard label="Exceeded (100%+)" value={critical.length} tone="danger" />
        </div>

        {/* Warning Queue */}
        {warning.length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-border-soft flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-risk-med" />
              <h2 className="text-sm font-semibold">Credit Limit Warning Queue</h2>
              <span className="badge badge-med text-[10px]">{warning.length}</span>
            </div>
            <div className="divide-y divide-border-soft">
              {warning.map((c) => (
                <ClientCreditRow key={c.id} client={c} />
              ))}
            </div>
          </div>
        )}

        {/* Critical */}
        {critical.length > 0 && (
          <div className="card overflow-hidden border-risk-crit/30">
            <div className="px-4 py-3 border-b border-border-soft flex items-center gap-2 bg-risk-crit/5">
              <ShieldAlert className="w-4 h-4 text-risk-crit" />
              <h2 className="text-sm font-semibold">Booking Hold Approval Queue</h2>
              <span className="badge badge-crit text-[10px]">{critical.length}</span>
            </div>
            <div className="divide-y divide-border-soft">
              {critical.map((c) => (
                <ClientCreditRow key={c.id} client={c} critical />
              ))}
            </div>
          </div>
        )}

        {/* OK */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border-soft flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-risk-low" />
            <h2 className="text-sm font-semibold">Healthy Accounts</h2>
            <span className="badge badge-low text-[10px]">{okClients.length}</span>
          </div>
          <div className="divide-y divide-border-soft">
            {okClients.map((c) => (
              <ClientCreditRow key={c.id} client={c} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientCreditRow({
  client,
  critical,
  compact,
}: {
  client: any;
  critical?: boolean;
  compact?: boolean;
}) {
  const pct = Math.round(client.utilizationPct * 100);
  const utilColor =
    client.utilizationPct >= 1.0
      ? "bg-risk-crit"
      : client.utilizationPct >= 0.8
      ? "bg-risk-med"
      : "bg-risk-low";
  return (
    <div className={cn("px-4 py-3 flex items-center gap-4", compact && "py-2")}>
      <div className="w-48 shrink-0">
        <div className="font-medium text-sm">{client.name}</div>
        <div className="text-[11px] text-fg-subtle">
          {client.code} · {client.tier}
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-fg-muted">
            Exposure {fmtMoney(client.outstanding + client.pipeline)} / Limit{" "}
            {fmtMoney(client.creditLimit)}
          </span>
          <span className="font-mono font-medium">{pct}%</span>
        </div>
        <div className="h-2 bg-bg-soft rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all", utilColor)}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {!compact && (
        <div className="flex items-center gap-2 shrink-0">
          {critical ? (
            <>
              <button className="btn btn-soft text-[11px]">View AI Risk</button>
              <button className="btn btn-primary text-[11px]">Approve / Reject</button>
            </>
          ) : (
            <button className="btn btn-soft text-[11px]">Review</button>
          )}
        </div>
      )}
    </div>
  );
}
