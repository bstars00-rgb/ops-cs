import { PageHeader } from "@/components/page-header";
import { KpiCard } from "@/components/kpi-card";
import { Download } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="운영·재무 트렌드. 13개 위젯. 자동 인사이트는 Phase 2."
        actions={
          <>
            <button className="btn btn-soft text-xs">7d</button>
            <button className="btn btn-primary text-xs">30d</button>
            <button className="btn btn-soft text-xs">90d</button>
            <button className="btn btn-soft text-xs">
              <Download className="w-3 h-3" /> Export
            </button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Confirmation Time (Avg)" value="14h 22m" trend="-32%" trendDir="down" tone="good" spark={[22, 20, 19, 17, 16, 15, 14]} />
          <KpiCard label="OPS 시간 회수 (주/인)" value="10.4h" trend="+18%" trendDir="up" tone="good" />
          <KpiCard label="Match 정확도" value="89%" trend="+4%" trendDir="up" tone="good" spark={[82, 84, 85, 86, 87, 88, 89]} />
          <KpiCard label="DSO" value="42d" trend="-9d" trendDir="down" tone="good" spark={[55, 53, 50, 48, 46, 44, 42]} />
        </div>

        {/* Widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Widget title="Cases by Issue Type" subtitle="30d, stacked by day">
            <BarStack data={[
              { name: "BOOKING_CONFIRMATION", value: 156, color: "#2f81f7" },
              { name: "PAYMENT_OVERDUE", value: 78, color: "#d29922" },
              { name: "SUPPLIER_DELAY", value: 64, color: "#3fb950" },
              { name: "CLIENT_INQUIRY", value: 48, color: "#a371f7" },
              { name: "REFUND", value: 22, color: "#db6d28" },
              { name: "URGENT_CHECKIN_ISSUE", value: 7, color: "#f85149" },
            ]} />
          </Widget>

          <Widget title="Cases by Hotel" subtitle="문제 호텔 Top 5">
            <BarStack data={[
              { name: "Phuket Beach Resort", value: 14, color: "#f85149" },
              { name: "ABC Hotel Da Nang", value: 12, color: "#db6d28" },
              { name: "Sakura Inn Kyoto", value: 9, color: "#d29922" },
              { name: "Phu Quoc Pearl", value: 7, color: "#d29922" },
              { name: "Hanoi Pearl", value: 4, color: "#3fb950" },
            ]} />
          </Widget>

          <Widget title="Cases by Language" subtitle="다국어 응대 비율">
            <BarStack data={[
              { name: "English", value: 142, color: "#2f81f7" },
              { name: "한국어", value: 96, color: "#a371f7" },
              { name: "Tiếng Việt", value: 64, color: "#3fb950" },
              { name: "日本語", value: 38, color: "#f0883e" },
              { name: "中文", value: 12, color: "#db6d28" },
            ]} />
          </Widget>

          <Widget title="SLA Breach Trend (30d)" subtitle="개선 추세">
            <Sparky values={[12, 14, 15, 13, 11, 9, 10, 8, 7, 7, 8, 6, 5]} color="#3fb950" />
            <p className="text-[11px] text-fg-muted mt-3">
              지난 30일간 SLA 위반 <span className="text-risk-low font-medium">−58%</span> 감소.
              AI Chase Scheduler 도입 후 야간 1차 follow-up 효과.
            </p>
          </Widget>

          <Widget title="Hotel No-Response Ranking" subtitle="협상력 데이터">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase text-fg-subtle">
                <tr>
                  <th className="text-left py-2">Hotel</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Avg Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {[
                  { name: "Phu Quoc Pearl", rate: 0.71, delay: "14h" },
                  { name: "Phuket Beach Resort", rate: 0.68, delay: "24h" },
                  { name: "ABC Hotel Da Nang", rate: 0.78, delay: "18h" },
                  { name: "Hanoi Pearl Hotel", rate: 0.85, delay: "9h" },
                  { name: "Osaka Riverside", rate: 0.88, delay: "6h" },
                ].map((h) => (
                  <tr key={h.name}>
                    <td className="py-2">{h.name}</td>
                    <td className="py-2 text-right font-mono">
                      <span className={h.rate < 0.75 ? "text-risk-crit" : h.rate < 0.85 ? "text-risk-med" : "text-fg"}>
                        {Math.round(h.rate * 100)}%
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-fg-muted">{h.delay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Widget>

          <Widget title="AI Confidence Distribution" subtitle="모델 건강도">
            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { range: ".5-.7", count: 8, color: "bg-risk-crit/40" },
                { range: ".7-.8", count: 24, color: "bg-risk-med/40" },
                { range: ".8-.9", count: 142, color: "bg-risk-low/40" },
                { range: ".9-.95", count: 218, color: "bg-risk-low/60" },
                { range: ".95+", count: 312, color: "bg-risk-low/80" },
              ].map((b) => (
                <div key={b.range}>
                  <div className={`h-16 ${b.color} rounded flex items-end justify-center pb-1 text-[10px] font-mono`}>
                    {b.count}
                  </div>
                  <div className="text-[10px] text-fg-subtle mt-1 font-mono">{b.range}</div>
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  );
}

function Widget({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      {subtitle && <p className="text-[11px] text-fg-subtle mt-0.5 mb-3">{subtitle}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function BarStack({ data }: { data: { name: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.name} className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-fg-muted truncate flex-1 mr-2">{d.name}</span>
            <span className="font-mono text-fg">{d.value}</span>
          </div>
          <div className="h-1.5 bg-bg-soft rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparky({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-16">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.4 + (v / max) * 0.6 }}
        />
      ))}
    </div>
  );
}
