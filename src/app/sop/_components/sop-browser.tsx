"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Sop } from "@/lib/sop-loader";

export function SopBrowser({ sops }: { sops: Sop[] }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sops) map.set(s.category, (map.get(s.category) || 0) + 1);
    return [...map.entries()]
      .map(([cat, count]) => ({ category: cat, count }))
      .sort((a, b) => b.count - a.count);
  }, [sops]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return sops.filter((s) => {
      if (category && s.category !== category) return false;
      if (!term) return true;
      const hay = [
        s.id,
        s.title,
        s.summary,
        s.category,
        ...(s.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [sops, q, category]);

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ID, 제목, 키워드 검색... (예: cancellation, agoda, ELLIS)"
          className="w-full bg-bg-card border border-border rounded-md px-3 py-2 text-sm
                     placeholder:text-fg-subtle focus:outline-none focus:border-accent/50 focus:bg-bg"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={cn(
            "px-3 py-1 rounded-full text-xs border transition-colors",
            !category
              ? "bg-bg-card border-fg-muted text-fg"
              : "border-border text-fg-muted hover:bg-bg-hover"
          )}
        >
          All ({sops.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.category}
            onClick={() => setCategory(category === c.category ? null : c.category)}
            className={cn(
              "px-3 py-1 rounded-full text-xs border transition-colors",
              category === c.category
                ? "bg-bg-card border-accent text-accent"
                : "border-border text-fg-muted hover:bg-bg-hover"
            )}
          >
            {c.category} ({c.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-fg-muted text-sm">검색 결과가 없습니다.</div>
          <button
            onClick={() => {
              setQ("");
              setCategory(null);
            }}
            className="text-accent hover:underline text-xs mt-2 inline-block"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((s) => (
            <Link key={s.id} href={`/sop/${s.slug}`} className="card card-hover p-4 group">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-fg-subtle">{s.id}</span>
                    <span className="badge badge-neutral text-[10px]">v{s.version}</span>
                    <span className="badge badge-accent text-[10px]">{s.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold leading-tight">{s.title}</h3>
                  <p className="text-[12px] text-fg-muted mt-1.5 leading-relaxed line-clamp-2">
                    {s.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-fg-subtle mt-3 pt-3 border-t border-border-soft">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {s.effective_date}
                    </span>
                    {s.estimated_time_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ~{s.estimated_time_minutes}분
                      </span>
                    )}
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-accent flex items-center gap-1">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
