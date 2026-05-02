import { PageHeader } from "@/components/page-header";
import { Sparkles, FileCode, Play, Pause, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const SOPS = [
  { id: "SOP_HOTEL_NO_RESPONSE", name: "Hotel No-Response", version: 3, executions30d: 142, humanInterventionPct: 18, enabled: true },
  { id: "SOP_SUPPLIER_NO_RESPONSE", name: "Supplier No-Response", version: 2, executions30d: 38, humanInterventionPct: 24, enabled: true },
  { id: "SOP_URGENT_CHECKIN", name: "Urgent Check-in Issue", version: 4, executions30d: 7, humanInterventionPct: 100, enabled: true },
  { id: "SOP_HOTEL_NO_RECORD", name: "Hotel Cannot Find Reservation", version: 2, executions30d: 11, humanInterventionPct: 65, enabled: true },
  { id: "SOP_OVERBOOKING", name: "Overbooking", version: 3, executions30d: 5, humanInterventionPct: 100, enabled: true },
  { id: "SOP_REFUND_REQUEST", name: "Refund Request", version: 2, executions30d: 22, humanInterventionPct: 100, enabled: true },
  { id: "SOP_NO_SHOW_DISPUTE", name: "No-show Dispute", version: 1, executions30d: 9, humanInterventionPct: 88, enabled: true },
  { id: "SOP_CLIENT_PAYMENT_OVERDUE", name: "Client Payment Overdue", version: 4, executions30d: 78, humanInterventionPct: 32, enabled: true },
  { id: "SOP_INVOICE_DUE_SOON", name: "Invoice Due Soon", version: 3, executions30d: 156, humanInterventionPct: 12, enabled: true },
  { id: "SOP_CREDIT_LIMIT_EXCEEDED", name: "Credit Limit Exceeded", version: 2, executions30d: 14, humanInterventionPct: 100, enabled: true },
  { id: "SOP_NEW_BOOKING_WITH_OUTSTANDING", name: "New Booking with Outstanding", version: 1, executions30d: 19, humanInterventionPct: 78, enabled: true },
  { id: "SOP_PARTIAL_PAYMENT", name: "Partial Payment", version: 2, executions30d: 31, humanInterventionPct: 45, enabled: true },
  { id: "SOP_PAYMENT_PROOF_MISMATCH", name: "Payment Proof Mismatch", version: 1, executions30d: 18, humanInterventionPct: 70, enabled: true },
  { id: "SOP_SALES_OVERRIDE_REQUEST", name: "Sales Override Request", version: 1, executions30d: 4, humanInterventionPct: 100, enabled: false },
  { id: "SOP_VIP_COMPLAINT", name: "VIP Client Complaint", version: 2, executions30d: 3, humanInterventionPct: 100, enabled: true },
  { id: "SOP_CANCELLATION_FEE_DISPUTE", name: "Cancellation Fee Dispute", version: 1, executions30d: 6, humanInterventionPct: 92, enabled: true },
];

export default function SopPage() {
  return (
    <div>
      <PageHeader
        title="SOP Library"
        subtitle="코드형 SOP. read-only (MVP). Phase 2 에서 visual editor 추가."
        actions={
          <button className="btn btn-primary text-xs">
            <Plus className="w-3 h-3" /> New SOP
          </button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SOPS.map((s) => (
            <div key={s.id} className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCode className="w-4 h-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{s.name}</div>
                    <div className="text-[11px] font-mono text-fg-subtle truncate">
                      {s.id} · v{s.version}
                    </div>
                  </div>
                </div>
                {s.enabled ? (
                  <span className="badge badge-low text-[10px]">
                    <Play className="w-2.5 h-2.5" /> ENABLED
                  </span>
                ) : (
                  <span className="badge badge-neutral text-[10px]">
                    <Pause className="w-2.5 h-2.5" /> DISABLED
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-soft">
                <div>
                  <div className="text-[10px] text-fg-subtle uppercase">Executions 30d</div>
                  <div className="text-sm font-medium mt-0.5">{s.executions30d}</div>
                </div>
                <div>
                  <div className="text-[10px] text-fg-subtle uppercase">Human Intervention</div>
                  <div
                    className={cn(
                      "text-sm font-medium mt-0.5",
                      s.humanInterventionPct === 100
                        ? "text-risk-crit"
                        : s.humanInterventionPct >= 50
                        ? "text-risk-med"
                        : "text-risk-low"
                    )}
                  >
                    {s.humanInterventionPct}%
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-fg-subtle mt-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {s.humanInterventionPct === 100
                  ? "사람 결재 강제 (안전 SOP)"
                  : s.humanInterventionPct < 30
                  ? "AI 자동 비율 높음"
                  : "AI 보조 + 사람 검토"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
