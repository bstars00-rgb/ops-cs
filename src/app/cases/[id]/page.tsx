import Link from "next/link";
import { notFound } from "next/navigation";
import { RiskBadge, PriorityBadge, StatusBadge, LangBadge } from "@/components/risk-badge";
import { SlaBar } from "@/components/sla-bar";
import { cases, caseMessages } from "@/lib/mock-data";
import { fmtRelative, fmtMoney } from "@/lib/utils";
import {
  ArrowLeft,
  Phone,
  RotateCw,
  MoreHorizontal,
  Sparkles,
  Hotel,
  CalendarDays,
  Building2,
  Plus,
  Bot,
  CheckCircle2,
  Edit3,
  X,
  Send,
  Lock,
  Clock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export default function CaseDetailPage({ params }: { params: { id: string } }) {
  const c = cases.find((x) => x.id === params.id);
  if (!c) notFound();
  const messages = caseMessages[c.id] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-bg-soft border-b border-border">
        <div className="px-6 py-3">
          {/* Top row */}
          <div className="flex items-center gap-3 mb-2">
            <Link href="/cases" className="text-xs text-fg-muted hover:text-fg flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Cases
            </Link>
            <span className="text-fg-subtle text-xs">/</span>
            <span className="text-xs font-mono text-fg">{c.code}</span>
            <span className="badge badge-neutral text-[10px] font-mono">
              {c.type.replace(/_/g, " ")}
            </span>
            <RiskBadge score={c.riskScore} />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold text-fg leading-tight">{c.subject}</h1>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-fg-subtle">Owner</span>
                  <button className="px-2 py-0.5 rounded bg-bg-card border border-border hover:bg-bg-hover">
                    {c.ownerName}
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-fg-subtle">Priority</span>
                  <PriorityBadge priority={c.priority} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-fg-subtle">Status</span>
                  <StatusBadge status={c.status} />
                </div>
                <LangBadge lang={c.language} />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {c.priority === "P0" && (
                <button className="btn btn-primary bg-risk-crit hover:bg-risk-crit/90 text-xs">
                  <AlertTriangle className="w-3 h-3" /> Take Over
                </button>
              )}
              {c.hotelName && (
                <button className="btn btn-soft text-xs">
                  <Phone className="w-3 h-3" /> Hotel Direct
                </button>
              )}
              <button className="btn btn-soft text-xs">
                <RotateCw className="w-3 h-3" /> Re-assign
              </button>
              <button className="btn btn-ghost text-xs">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SLA */}
          <div className="mt-3">
            <SlaBar remainingSec={c.slaRemainingSec} totalSec={c.slaTotalSec} />
          </div>
        </div>
      </div>

      {/* Body 3-region */}
      <div className="flex-1 flex min-h-0">
        {/* Left rail */}
        <aside className="w-72 border-r border-border bg-bg-soft p-4 space-y-4 overflow-y-auto shrink-0">
          {/* Client */}
          <RailCard
            title="Client"
            icon={Building2}
            content={
              <>
                <div className="text-sm font-medium">{c.clientName}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="badge badge-accent text-[10px]">VIP</span>
                  <span className="text-[11px] text-fg-muted">VN · ko</span>
                </div>
                <div className="text-[11px] text-fg-muted mt-2">
                  AM: <span className="text-fg">Kim AM</span>
                </div>
                <div className="text-[11px] text-fg-muted mt-1">
                  Credit util: <span className="text-fg">60%</span> · DSO 42d
                </div>
                <Link
                  href="/clients"
                  className="text-[11px] text-accent hover:underline mt-2 inline-block"
                >
                  Open 360 view →
                </Link>
              </>
            }
          />

          {/* Reservation */}
          {c.bookingCode && (
            <RailCard
              title="Reservation"
              icon={CalendarDays}
              content={
                <>
                  <div className="text-xs font-mono text-fg">{c.bookingCode}</div>
                  <div className="text-sm font-medium mt-1">{c.hotelName || "—"}</div>
                  <div className="text-[11px] text-fg-muted mt-2 space-y-0.5">
                    <div>CI 2026-05-10 / CO 2026-05-12</div>
                    <div>1× Deluxe Twin · 2 guests</div>
                    <div className="text-fg">{fmtMoney(480)}</div>
                  </div>
                  <Link
                    href="#"
                    className="text-[11px] text-accent hover:underline mt-2 inline-block"
                  >
                    Detail →
                  </Link>
                </>
              }
            />
          )}

          {/* Hotel */}
          {c.hotelName && (
            <RailCard
              title="Hotel/Supplier"
              icon={Hotel}
              content={
                <>
                  <div className="text-sm font-medium">{c.hotelName}</div>
                  <div className="text-[11px] text-fg-muted mt-1">VN · vi/en</div>
                  <div className="text-[11px] text-fg-muted mt-2">
                    응답률 30d: <span className="text-fg">78%</span>
                  </div>
                  <div className="text-[11px] text-fg-muted">평균: 18h</div>
                  <div className="text-[11px] text-fg-muted mt-1">
                    마지막 컨펌: 2026-05-08 18:00
                  </div>
                  <button className="btn btn-soft text-[11px] mt-2 w-full justify-center">
                    <Phone className="w-3 h-3" /> +84-236-...
                  </button>
                </>
              }
            />
          )}

          {/* Quick Actions */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-2 px-1">
              Quick Actions
            </div>
            <div className="space-y-1">
              <button className="btn btn-soft text-xs w-full justify-start">
                <Plus className="w-3 h-3" /> Add Note
              </button>
              <button className="btn btn-soft text-xs w-full justify-start">
                <Plus className="w-3 h-3" /> Add Task
              </button>
              <button className="btn btn-soft text-xs w-full justify-start">
                Link Reservation
              </button>
              <button className="btn btn-soft text-xs w-full justify-start text-risk-crit">
                <AlertTriangle className="w-3 h-3" /> Escalate
              </button>
            </div>
          </div>
        </aside>

        {/* Center */}
        <div className="flex-1 overflow-y-auto min-w-0">
          <div className="p-6 space-y-4">
            {/* AI Suggested Next Action */}
            <div className="card border-accent/30 bg-accent/5 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-accent">
                      AI Suggested Next Action
                    </span>
                    <span className="badge badge-accent text-[10px]">conf 0.97</span>
                  </div>
                  <p className="text-sm text-fg leading-snug">
                    호텔 직통 통화 또는 대체 호텔 즉시 수배.
                  </p>
                  <p className="text-[11px] text-fg-muted mt-1.5 leading-relaxed">
                    Why: 게스트 D-0 + 36h 호텔 무응답 + VIP. SOP_URGENT_CHECKIN 활성. 대체 호텔 후보 3개 자동 생성됨.
                  </p>
                </div>
                <button className="btn btn-primary text-xs shrink-0">
                  Take Action
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border-soft flex items-center gap-1">
              {[
                { label: "Timeline", count: messages.length, active: true },
                { label: "Drafts", count: 1 },
                { label: "Tasks", count: 2 },
                { label: "Files", count: 3 },
              ].map((t) => (
                <button
                  key={t.label}
                  className={`px-3 py-2 text-xs border-b-2 transition-colors ${
                    t.active
                      ? "border-accent text-fg"
                      : "border-transparent text-fg-muted hover:text-fg"
                  }`}
                >
                  {t.label}
                  <span className="ml-1.5 text-fg-subtle">{t.count}</span>
                </button>
              ))}
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              {messages.map((m) => (
                <TimelineCard key={m.id} m={m} />
              ))}
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="sticky bottom-0 bg-bg-soft/95 backdrop-blur border-t border-border px-6 py-3 flex items-center gap-2">
            <button className="btn btn-primary text-xs">
              <Sparkles className="w-3 h-3" /> Reply (AI)
            </button>
            <button className="btn btn-soft text-xs">
              <Send className="w-3 h-3" /> New Hotel Email
            </button>
            <button className="btn btn-soft text-xs">
              <Edit3 className="w-3 h-3" /> Note
            </button>
            <button className="btn btn-soft text-xs">
              <Clock className="w-3 h-3" /> Snooze
            </button>
            <div className="flex-1" />
            <button className="btn btn-soft text-xs">
              <CheckCircle2 className="w-3 h-3" /> Resolve
            </button>
          </div>
        </div>

        {/* Right rail */}
        <aside className="w-72 border-l border-border bg-bg-soft p-4 space-y-4 overflow-y-auto shrink-0">
          {/* SOP Progress */}
          <div className="card p-3">
            <div className="text-xs font-semibold mb-2">SOP Progress</div>
            <div className="text-[11px] font-mono text-fg-muted mb-2">SOP_URGENT_CHECKIN</div>
            <div className="space-y-1.5">
              {[
                { label: "P0 분류 + 알림", done: true },
                { label: "증거 자동 첨부", done: true },
                { label: "AI 드래프트 생성", done: true },
                { label: "사람 승인 대기", inProgress: true },
                { label: "발송", upcoming: true },
                { label: "호텔 응답 / 대체 결정", upcoming: true },
                { label: "Resolution + 보상 결재", upcoming: true },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px]">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      s.done
                        ? "bg-risk-low/20 text-risk-low"
                        : s.inProgress
                        ? "bg-risk-med/20 text-risk-med"
                        : "bg-bg-soft text-fg-subtle border border-border"
                    }`}
                  >
                    {s.done ? "✓" : s.inProgress ? "•" : ""}
                  </div>
                  <span className={s.done ? "text-fg-muted line-through" : "text-fg"}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="#"
              className="text-[10px] text-accent hover:underline mt-2 inline-flex items-center gap-0.5"
            >
              View execution timeline <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Related */}
          <div className="card p-3">
            <div className="text-xs font-semibold mb-2">Related</div>
            <div className="space-y-2 text-[11px]">
              <div>
                <div className="text-fg-muted">Invoice</div>
                <Link href="/billing" className="text-accent hover:underline">
                  INV-2026-04-1012 ($12K, PENDING)
                </Link>
              </div>
              <div>
                <div className="text-fg-muted">Parent</div>
                <span className="text-fg-subtle">—</span>
              </div>
              <div>
                <div className="text-fg-muted">Children</div>
                <span className="text-fg-subtle">0</span>
              </div>
            </div>
          </div>

          {/* AI Decisions */}
          <div className="card p-3">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-accent" /> AI Decisions
            </div>
            <div className="text-[11px] text-fg-muted">3 calls today</div>
            <div className="text-[11px] text-fg-muted">Spent $0.04</div>
            <Link
              href="#"
              className="text-[10px] text-accent hover:underline mt-2 inline-flex items-center gap-0.5"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Audit */}
          <div className="card p-3">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-fg-muted" /> Audit (last 5)
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                "Status → ESCALATED_TO_HUMAN",
                "Owner ← Sarah Lee",
                "SLA threshold 80%",
                "AI draft generated",
                "Case created",
              ].map((a, i) => (
                <div key={i} className="text-fg-muted">
                  • {a}
                </div>
              ))}
            </div>
            <Link
              href="#"
              className="text-[10px] text-accent hover:underline mt-2 inline-flex items-center gap-0.5"
            >
              Full log <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function RailCard({
  title,
  icon: Icon,
  content,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-2 px-1 flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {title}
      </div>
      <div className="card p-3">{content}</div>
    </div>
  );
}

function TimelineCard({ m }: { m: any }) {
  const styles =
    m.direction === "INBOUND"
      ? "border-l-2 border-l-risk-low"
      : m.direction === "OUTBOUND"
      ? "border-l-2 border-l-fg-subtle"
      : m.direction === "AI_ACTION"
      ? "border-l-2 border-l-accent bg-accent/5"
      : m.direction === "INTERNAL_NOTE"
      ? "border-l-2 border-l-risk-med bg-risk-med/5"
      : m.direction === "ESCALATION"
      ? "border-l-2 border-l-risk-crit bg-risk-crit/5"
      : "border-l-2 border-l-border";

  const icon =
    m.actorKind === "AI" ? "🤖" : m.actorKind === "SYSTEM" ? "⚙" : m.actorKind === "CLIENT" ? "🟢" : m.actorKind === "HOTEL" ? "🔵" : "👤";

  return (
    <div className={`card ${styles} p-3`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium">{m.actor}</span>
          {m.confidence && (
            <span className="badge badge-accent text-[10px]">conf {m.confidence}</span>
          )}
          {m.pendingApproval && (
            <span className="badge badge-med text-[10px]">PENDING APPROVAL</span>
          )}
        </div>
        <span className="text-[10px] text-fg-subtle">{fmtRelative(m.at)}</span>
      </div>
      {m.subject && (
        <div className="text-sm font-medium text-fg mb-1">{m.subject}</div>
      )}
      <div className="text-xs text-fg-muted whitespace-pre-wrap leading-relaxed">
        {m.body}
      </div>
      {m.pendingApproval && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-soft">
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
      )}
    </div>
  );
}
