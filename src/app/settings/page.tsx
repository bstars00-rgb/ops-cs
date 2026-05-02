import { PageHeader } from "@/components/page-header";
import { Settings, Mail, Slack, Database, Webhook, Lock, FileText, Users } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Workspace · Users · Integrations · SLA · SOP · Webhooks · API · Audit"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "General", desc: "워크스페이스명, 로고, 시간대, 작업 언어 (KO/EN/VI/JA/ZH)", icon: Settings, badge: "ko · Asia/Seoul" },
            { title: "Users & Roles", desc: "5 시스템 역할 (OPS/CS/Finance/Leader/Admin) + 권한 매트릭스", icon: Users, badge: "12 active" },
            { title: "Email Accounts", desc: "Gmail OAuth + Microsoft Graph + IMAP fallback", icon: Mail, badge: "2 connected", status: "ok" },
            { title: "Slack Notifications", desc: "에스컬레이션 + SLA 위반 + 승인 알림 채널", icon: Slack, badge: "1 webhook", status: "ok" },
            { title: "ERP Integration", desc: "Xero / 더존 / SAP — Phase 2", icon: Database, badge: "Not connected", status: "warn" },
            { title: "SLA Rules", desc: "9개 SLA 룰 — Client / Hotel / Supplier / Payment / Approval", icon: Lock, badge: "9 active" },
            { title: "SOP Library", desc: "16 SOP 템플릿 (read-only MVP)", icon: FileText, badge: "15 enabled, 1 disabled" },
            { title: "Webhooks", desc: "외부 시스템으로 이벤트 푸시 (HMAC-SHA256)", icon: Webhook, badge: "3 endpoints" },
            { title: "API Keys", desc: "외부 통합용 발급 + scope + rate limit", icon: Lock, badge: "1 key" },
            { title: "Audit Log", desc: "모든 사람·AI 액션 immutable 기록 (7년)", icon: FileText, badge: "47,238 events" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="card card-hover p-4 cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{s.title}</div>
                    <p className="text-[11px] text-fg-muted mt-1 leading-relaxed">{s.desc}</p>
                    <div className="mt-3">
                      <span
                        className={`badge text-[10px] ${
                          s.status === "warn" ? "badge-med" : s.status === "ok" ? "badge-low" : "badge-neutral"
                        }`}
                      >
                        {s.badge}
                      </span>
                    </div>
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
