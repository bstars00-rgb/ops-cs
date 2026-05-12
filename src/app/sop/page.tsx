import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getAllSops } from "@/lib/sop-loader";
import { BookOpen } from "lucide-react";
import { SopBrowser } from "./_components/sop-browser";

export default function SopPage() {
  const all = getAllSops();

  return (
    <div>
      <PageHeader
        title="SOP Library"
        subtitle={`${all.length}개 SOP · VNOP Operations · 누구든지 확인·이해·진행 가능하도록 표준화됨`}
        actions={
          <Link
            href="https://github.com/bstars00-rgb/ops-cs/blob/main/sops/README.md"
            target="_blank"
            className="btn btn-soft text-xs"
          >
            <BookOpen className="w-3 h-3" /> 편집 가이드
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        <SopBrowser sops={all} />

        <div className="text-[11px] text-fg-subtle text-center pt-6">
          원본 문서: <code className="font-mono">SOP/VNOP_SOP_All_v1.0.docx</code> · 수정은{" "}
          <code className="font-mono">sops/*.md</code> 파일 직접 편집 (git 으로 자동 배포)
        </div>
      </div>
    </div>
  );
}
