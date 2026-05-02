import { PageHeader } from "@/components/page-header";
import { clients } from "@/lib/mock-data";
import { fmtMoney, cn } from "@/lib/utils";
import { Plus, Filter } from "lucide-react";

export default function ClientsPage() {
  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} B2B 거래처 · 신용 한도 + 미수 + 결제 행동 통합 뷰`}
        actions={
          <>
            <button className="btn btn-soft text-xs">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="btn btn-primary text-xs">
              <Plus className="w-3 h-3" /> Add Client
            </button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        {/* Tier filter chips */}
        <div className="flex items-center gap-2 text-xs">
          {["All", "VIP", "Premium", "Standard", "Trial"].map((t, i) => (
            <button
              key={t}
              className={cn(
                "px-3 py-1 rounded-full border",
                i === 0
                  ? "bg-bg-card border-fg-muted text-fg"
                  : "border-border text-fg-muted hover:bg-bg-hover"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {clients.map((c) => {
            const utilColor =
              c.utilizationPct >= 0.9
                ? "bg-risk-crit"
                : c.utilizationPct >= 0.8
                ? "bg-risk-high"
                : c.utilizationPct >= 0.6
                ? "bg-risk-med"
                : "bg-risk-low";
            const tierBadge =
              c.tier === "VIP"
                ? "badge-accent"
                : c.tier === "Premium"
                ? "badge-med"
                : "badge-neutral";
            return (
              <div key={c.id} className="card card-hover p-4 cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{c.name}</div>
                    <div className="text-[11px] font-mono text-fg-subtle">{c.code}</div>
                  </div>
                  <span className={cn("badge text-[10px]", tierBadge)}>{c.tier}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-fg-muted mb-3">
                  <span className="badge badge-neutral text-[10px]">{c.country}</span>
                  <span>·</span>
                  <span>AM: {c.accountManager}</span>
                </div>

                {/* Credit utilization */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-fg-muted">Credit utilization</span>
                    <span className="font-mono text-fg">
                      {Math.round(c.utilizationPct * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-soft rounded-full overflow-hidden">
                    <div className={cn("h-full", utilColor)} style={{ width: `${Math.min(c.utilizationPct * 100, 100)}%` }} />
                  </div>
                  <div className="text-[10px] text-fg-subtle">
                    {fmtMoney(c.outstanding + c.pipeline, c.currency)} / {fmtMoney(c.creditLimit, c.currency)}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-soft text-center">
                  <div>
                    <div className="text-[10px] text-fg-subtle uppercase">Outstanding</div>
                    <div className="text-xs font-medium mt-0.5">
                      {fmtMoney(c.outstanding, c.currency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-fg-subtle uppercase">DSO</div>
                    <div
                      className={cn(
                        "text-xs font-medium mt-0.5",
                        c.avgDso > 60 ? "text-risk-crit" : c.avgDso > 45 ? "text-risk-med" : "text-fg"
                      )}
                    >
                      {c.avgDso}d
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-fg-subtle uppercase">30d Bookings</div>
                    <div className="text-xs font-medium mt-0.5">{c.bookings30d}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
