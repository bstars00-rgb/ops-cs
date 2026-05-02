import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { RiskBadge, PriorityBadge, LangBadge } from "@/components/risk-badge";
import { SlaBar } from "@/components/sla-bar";
import { cases } from "@/lib/mock-data";
import { fmtRelative } from "@/lib/utils";
import { Mail, Filter, Inbox as InboxIcon } from "lucide-react";

export default function InboxPage() {
  const sorted = [...cases].sort((a, b) => {
    const pa = ["P0", "P1", "P2", "P3"].indexOf(a.priority);
    const pb = ["P0", "P1", "P2", "P3"].indexOf(b.priority);
    if (pa !== pb) return pa - pb;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div>
      <PageHeader
        title="Unified Inbox"
        subtitle="이메일 + 알림 + 노트가 케이스로 묶여 시간순 처리. ⌥+J / ⌥+K 로 이동."
        actions={
          <>
            <button className="btn btn-soft text-xs">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="btn btn-soft text-xs">Saved Views</button>
          </>
        }
      />

      <div className="flex h-[calc(100vh-3.5rem-4rem)]">
        {/* Filter rail */}
        <div className="w-44 border-r border-border bg-bg-soft p-3 space-y-1 text-xs shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle px-2 mb-1">
            큐
          </div>
          {[
            { label: "전체 (47)", active: true, icon: InboxIcon },
            { label: "내 케이스 (12)" },
            { label: "Unread (8)" },
            { label: "SLA Breach (3)", danger: true },
            { label: "P0 Urgent (1)", danger: true },
            { label: "Waiting Hotel (23)" },
            { label: "Waiting Client (8)" },
            { label: "Need Match (4)" },
          ].map((q, i) => (
            <button
              key={i}
              className={`w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center gap-2 ${
                q.active ? "bg-bg-hover text-fg" : "text-fg-muted hover:text-fg hover:bg-bg-hover"
              } ${q.danger ? "text-risk-crit" : ""}`}
            >
              {q.icon && <q.icon className="w-3 h-3" />}
              <span>{q.label}</span>
            </button>
          ))}

          <div className="text-[10px] uppercase tracking-wider text-fg-subtle px-2 mb-1 mt-4">
            언어
          </div>
          {[
            { label: "한국어", count: 4 },
            { label: "English", count: 3 },
            { label: "Tiếng Việt", count: 2 },
            { label: "日本語", count: 1 },
          ].map((l) => (
            <button
              key={l.label}
              className="w-full text-left px-2 py-1.5 rounded-md text-fg-muted hover:bg-bg-hover hover:text-fg flex items-center justify-between"
            >
              <span>{l.label}</span>
              <span className="text-fg-subtle">{l.count}</span>
            </button>
          ))}
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-border-soft">
            {sorted.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors group"
              >
                <div className="flex flex-col items-center gap-1 w-2 shrink-0">
                  {c.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                </div>

                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-purple-500/30 flex items-center justify-center text-[11px] font-medium shrink-0">
                  {c.clientName
                    .split(" ")
                    .slice(0, 2)
                    .map((s) => s[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm ${c.unread ? "font-semibold text-fg" : "text-fg-muted"}`}>
                      {c.clientName}
                    </span>
                    <span className="text-xs font-mono text-fg-subtle">{c.code}</span>
                    <LangBadge lang={c.language} />
                    <PriorityBadge priority={c.priority} />
                    <RiskBadge score={c.riskScore} withScore={false} />
                  </div>
                  <div className={`text-sm truncate ${c.unread ? "text-fg" : "text-fg-muted"}`}>
                    <span className="font-medium">{c.subject}</span>
                    <span className="text-fg-subtle"> — {c.preview}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0 w-32">
                  <span className="text-[10px] text-fg-subtle">{fmtRelative(c.updatedAt)}</span>
                  <SlaBar
                    remainingSec={c.slaRemainingSec}
                    totalSec={c.slaTotalSec}
                    compact
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
