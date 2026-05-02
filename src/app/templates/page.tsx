import { PageHeader } from "@/components/page-header";
import { Mail, Plus } from "lucide-react";

const templates = [
  { name: "Hotel Inquiry — 1차 (gentle)", lang: "EN", tone: "gentle", uses: 142, kind: "HOTEL_INQUIRY" },
  { name: "Hotel Chase — 2차 (polite_firm)", lang: "EN", tone: "polite_firm", uses: 89, kind: "HOTEL_INQUIRY" },
  { name: "Hotel Chase — 3차 (firm)", lang: "EN", tone: "firm", uses: 34, kind: "HOTEL_INQUIRY" },
  { name: "Hotel Inquiry — 베트남어", lang: "VI", tone: "polite", uses: 56, kind: "HOTEL_INQUIRY" },
  { name: "Client Status Update — 한국어", lang: "KO", tone: "polite_korean_formal", uses: 218, kind: "CLIENT_REPLY" },
  { name: "Client Confirmation — 한국어", lang: "KO", tone: "polite_korean_formal", uses: 184, kind: "CLIENT_REPLY" },
  { name: "Client Apology — 한국어", lang: "KO", tone: "apology", uses: 12, kind: "CLIENT_REPLY" },
  { name: "Collection D-7 (gentle)", lang: "KO", tone: "gentle", uses: 78, kind: "COLLECTION" },
  { name: "Collection D+1 (polite_firm)", lang: "KO", tone: "polite_firm", uses: 45, kind: "COLLECTION" },
  { name: "Collection D+3 (firm)", lang: "KO", tone: "firm", uses: 22, kind: "COLLECTION" },
  { name: "Collection D+14 (final_notice)", lang: "KO", tone: "final_notice", uses: 4, kind: "COLLECTION" },
  { name: "Internal Note — 사고 보고", lang: "KO", tone: "internal", uses: 35, kind: "INTERNAL" },
];

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        title="Templates"
        subtitle="메일 템플릿 · AI 드래프트의 시드. 사용 통계 자동 학습."
        actions={
          <button className="btn btn-primary text-xs">
            <Plus className="w-3 h-3" /> New Template
          </button>
        }
      />

      <div className="p-6">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-soft border-b border-border">
              <tr className="text-[11px] uppercase tracking-wider text-fg-subtle">
                <th className="text-left px-4 py-2.5 font-medium">Template</th>
                <th className="text-left px-3 py-2.5 font-medium">Kind</th>
                <th className="text-left px-3 py-2.5 font-medium">Lang</th>
                <th className="text-left px-3 py-2.5 font-medium">Tone</th>
                <th className="text-right px-3 py-2.5 font-medium">Uses 30d</th>
                <th className="text-right px-4 py-2.5 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t, i) => (
                <tr key={i} className="table-row">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span className="font-medium">{t.name}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="badge badge-accent text-[10px]">{t.kind}</span>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{t.lang}</td>
                  <td className="px-3 py-3 text-xs text-fg-muted">{t.tone}</td>
                  <td className="px-3 py-3 text-right font-mono">{t.uses}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn btn-soft text-[11px]">Preview</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
