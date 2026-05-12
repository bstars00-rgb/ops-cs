import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllSops, getSopBySlug } from "@/lib/sop-loader";
import { PageHeader } from "@/components/page-header";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  User,
  Users,
  ArrowUp,
  Printer,
  Github,
} from "lucide-react";

export function generateStaticParams() {
  return getAllSops().map((s) => ({ slug: s.slug }));
}

export default function SopDetailPage({ params }: { params: { slug: string } }) {
  const sop = getSopBySlug(params.slug);
  if (!sop) notFound();

  return (
    <div>
      <PageHeader
        title={sop.title}
        subtitle={sop.summary}
        actions={
          <>
            <Link
              href={`https://github.com/bstars00-rgb/ops-cs/edit/main/sops/${sop.slug}.md`}
              target="_blank"
              className="btn btn-soft text-xs"
            >
              <Github className="w-3 h-3" /> 편집
            </Link>
            <Link
              href={`https://github.com/bstars00-rgb/ops-cs/commits/main/sops/${sop.slug}.md`}
              target="_blank"
              className="btn btn-soft text-xs"
            >
              변경 이력
            </Link>
          </>
        }
      />

      <div className="px-6 py-3">
        <Link href="/sop" className="text-xs text-fg-muted hover:text-fg flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> All SOPs
        </Link>
      </div>

      <div className="px-6 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main content */}
        <article className="card p-6 sop-prose max-w-none">
          {/* Document meta header */}
          <div className="border-b border-border-soft pb-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-fg-subtle">{sop.id}</span>
              <span className="badge badge-neutral text-[10px]">v{sop.version}</span>
              <span className="badge badge-accent text-[10px]">{sop.category}</span>
            </div>
            <h1 className="text-xl font-semibold">{sop.title}</h1>
            <p className="text-sm text-fg-muted mt-2">{sop.summary}</p>
          </div>

          {/* Markdown body */}
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {sop.content}
          </ReactMarkdown>
        </article>

        {/* Side rail */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="card p-4 space-y-3 text-xs">
            <Meta icon={Calendar} label="발효일" value={sop.effective_date} />
            <Meta icon={User} label="작성자" value={sop.prepared_by} />
            <Meta icon={Users} label="팀" value={sop.team} />
            {sop.estimated_time_minutes && (
              <Meta icon={Clock} label="평균 소요" value={`${sop.estimated_time_minutes}분`} />
            )}
            {sop.escalation_to && (
              <Meta icon={ArrowUp} label="에스컬레이션" value={sop.escalation_to} />
            )}
            {sop.recurrence && (
              <Meta icon={Clock} label="주기" value={sop.recurrence} />
            )}
          </div>

          {sop.keywords && sop.keywords.length > 0 && (
            <div className="card p-4">
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-2 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> Keywords
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sop.keywords.map((k) => (
                  <span key={k} className="badge badge-neutral text-[10px] font-mono">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sop.related && sop.related.length > 0 && (
            <div className="card p-4">
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-2">
                관련 SOP
              </div>
              <div className="space-y-1">
                {sop.related.map((id) => (
                  <Link
                    key={id}
                    href={`/sop/${id}`}
                    className="block text-sm text-accent hover:underline font-mono"
                  >
                    {id}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="card p-4 text-[11px] text-fg-muted leading-relaxed">
            <div className="text-fg-subtle uppercase text-[10px] tracking-wider mb-1">원본</div>
            <code className="font-mono">SOP/VNOP_SOP_All_v1.0.docx</code>
            <div className="text-fg-subtle uppercase text-[10px] tracking-wider mt-2 mb-1">파일</div>
            <code className="font-mono">sops/{sop.slug}.md</code>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-fg-muted shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="text-xs text-fg">{value}</div>
      </div>
    </div>
  );
}

// Markdown component overrides for nice styling
const mdComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-lg font-bold mt-6 mb-3 text-fg">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-base font-bold mt-6 mb-2 text-fg border-b border-border-soft pb-1">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-sm font-semibold mt-4 mb-2 text-accent">{children}</h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-sm font-semibold mt-3 mb-1.5 text-fg">{children}</h4>
  ),
  p: ({ children }: any) => (
    <p className="text-sm text-fg leading-relaxed mb-3">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-outside pl-5 space-y-1.5 mb-3 text-sm text-fg">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside pl-5 space-y-1.5 mb-3 text-sm text-fg">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-risk-med pl-4 py-2 my-3 bg-risk-med/5 text-sm text-fg-muted italic">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }: any) =>
    inline ? (
      <code className="font-mono text-[12px] bg-bg-soft px-1 py-0.5 rounded">{children}</code>
    ) : (
      <pre className="bg-bg-soft border border-border rounded p-3 overflow-x-auto text-[12px] font-mono my-3">
        <code>{children}</code>
      </pre>
    ),
  strong: ({ children }: any) => <strong className="font-semibold text-fg">{children}</strong>,
  em: ({ children }: any) => <em className="italic">{children}</em>,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-xs border border-border-soft rounded">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => <thead className="bg-bg-soft">{children}</thead>,
  th: ({ children }: any) => (
    <th className="text-left px-3 py-2 font-semibold text-fg border-b border-border">{children}</th>
  ),
  tr: ({ children }: any) => <tr className="border-b border-border-soft last:border-0">{children}</tr>,
  td: ({ children }: any) => <td className="px-3 py-2 text-fg align-top">{children}</td>,
  hr: () => <hr className="border-border my-6" />,
  a: ({ href, children }: any) => {
    const internal = href?.startsWith("./SOP-");
    if (internal) {
      const slug = href.replace("./", "").replace(".md", "");
      return (
        <Link href={`/sop/${slug}`} className="text-accent hover:underline font-mono">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className="text-accent hover:underline">
        {children}
      </a>
    );
  },
};
