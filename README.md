# OpsCS — AI Travel Operations OS

> **B2B 호텔/여행 운영 조직을 위한 AI 운영 플랫폼 프로토타입**
> 호텔 부킹 CS · 공급선 추격 · 빌링 · 수금 · 미수 관리 · 신용 통제 · SOP 기반 에스컬레이션

본 저장소는 [PRD v1.0](#) 의 핵심 화면을 Next.js 14 + TypeScript + TailwindCSS 로 구현한 **클릭 가능한 프로토타입**입니다. 디자인 파트너 인터뷰 및 데모용으로 사용됩니다.

---

## 🎯 무엇이 들어있나

12개 화면이 mock data 와 함께 작동합니다:

| # | 화면 | 경로 | 핵심 |
|---|---|---|---|
| 1 | **Dashboard** | `/` | 14 KPI cards · Priority Queue · Active Escalations · Approval Queue |
| 2 | **Unified Inbox** | `/inbox` | 이메일+케이스 통합 인박스 + 언어/큐 필터 |
| 3 | **Cases List** | `/cases` | 47 케이스 큐 + Saved Views + risk/priority/SLA 정렬 |
| 4 | **Case Detail** | `/cases/[id]` | 4-region 레이아웃 (헤더/좌측/중앙/우측) + AI Suggested Action + Timeline + SOP Progress |
| 5 | **Reservations** | `/reservations` | 부킹 마스터 |
| 6 | **Approvals** | `/approvals` | AI 드래프트 + 결재 요청 통합 큐 |
| 7 | **Escalations** | `/escalations` | 에스컬레이션 ack/처리 큐 |
| 8 | **Clients** | `/clients` | B2B 거래처 360 카드 + Credit utilization |
| 9 | **Hotels & Suppliers** | `/hotels` | 응답률 30d / 평균 응답시간 / SLA / Auto-send |
| 10 | **Billing** | `/billing` | 인보이스 + Status + Aging + AI Dunning |
| 11 | **Outstanding** | `/outstanding` | Aging Heatmap + Risk Watchlist |
| 12 | **Credit Control** | `/credit` | Warning / Critical / Healthy 큐 + Utilization 게이지 |
| 13 | **SOP Library** | `/sop` | 16 SOP 템플릿 + executions / human intervention rate |
| 14 | **Templates** | `/templates` | 12 메일 템플릿 (다국어) |
| 15 | **Analytics** | `/analytics` | 13 위젯 (Cases by type/hotel/lang, SLA trend, AI confidence dist 등) |
| 16 | **Settings** | `/settings` | Workspace · Users · Integrations · SLA · SOP · Webhooks · API · Audit |

---

## 🛠️ 기술 스택

| 레이어 | 선택 |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + 자체 design tokens |
| Icons | lucide-react |
| Utility | clsx + tailwind-merge |

**참고**: 본 프로토타입은 **백엔드 없음**. mock-data.ts 의 정적 데이터로 모든 화면이 작동합니다. 실제 빌드는 PRD §17~19 (Database / API / Architecture) 참조.

---

## 🚀 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작
npm run dev

# 3. 브라우저에서 열기
# → http://localhost:3000
```

빌드 검증:

```bash
npm run build
```

---

## ☁️ Vercel 배포 (권장)

가장 쉬운 배포 경로 — **GitHub → Vercel 자동 배포**:

### 1단계: GitHub 푸시

```bash
git init
git add .
git commit -m "feat: initial OpsCS prototype"
git branch -M main
git remote add origin https://github.com/bstars00-rgb/ops-cs.git
git push -u origin main
```

### 2단계: Vercel 연결

1. [vercel.com/new](https://vercel.com/new) 에서 GitHub 저장소 import
2. **Framework Preset**: Next.js (자동 인식)
3. **Build Command**: `npm run build` (기본값)
4. **Output Directory**: `.next` (기본값)
5. Deploy 클릭 → 약 2분 후 배포 완료

이후 `main` 브랜치에 push 할 때마다 자동 배포됩니다.

### 3단계: 커스텀 도메인 (선택)

Vercel 대시보드 → Project Settings → Domains 에서 추가.

---

## 📁 디렉토리 구조

```
ops-cs/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── README.md
├── .gitignore
└── src/
    ├── app/
    │   ├── layout.tsx          # 사이드바 + 탑바 셸
    │   ├── globals.css         # Tailwind + design tokens
    │   ├── page.tsx            # Dashboard
    │   ├── inbox/page.tsx
    │   ├── cases/
    │   │   ├── page.tsx        # 케이스 리스트
    │   │   └── [id]/page.tsx   # 케이스 상세 (가장 중요한 화면)
    │   ├── reservations/page.tsx
    │   ├── approvals/page.tsx
    │   ├── escalations/page.tsx
    │   ├── clients/page.tsx
    │   ├── hotels/page.tsx
    │   ├── billing/page.tsx
    │   ├── outstanding/page.tsx
    │   ├── credit/page.tsx
    │   ├── sop/page.tsx
    │   ├── templates/page.tsx
    │   ├── analytics/page.tsx
    │   └── settings/page.tsx
    ├── components/
    │   ├── sidebar.tsx
    │   ├── topbar.tsx
    │   ├── page-header.tsx
    │   ├── kpi-card.tsx
    │   ├── risk-badge.tsx
    │   └── sla-bar.tsx
    ├── lib/
    │   ├── utils.ts            # cn / fmtMoney / fmtRelative / riskBand
    │   └── mock-data.ts        # cases / hotels / clients / invoices / escalations / approvals
    └── types/
        └── index.ts            # Case / CaseType / Status / Hotel / Client / Invoice ...
```

---

## 🎨 디자인 원칙 (PRD §20.4)

1. **OPS Speed First** — 키보드 단축키, 1클릭 완결, ≤1.5s 페이지 로드
2. **Clear Next Action** — 모든 케이스 화면 상단 "AI Suggested Next Action" 카드
3. **One Case, One Truth** — Finance/OPS/Sales 가 같은 화면을 봄
4. **Human Approval Visibility** — 모든 외부 발송에 승인자 라벨 + AI 워터마크
5. **Risk-First Prioritization** — 큐 디폴트 정렬: risk → priority → SLA
6. **No Hidden AI Action** — 모든 AI 액션 timeline + Why? 펼치기
7. **Timeline-Based Accountability** — 사람·AI·시스템 같은 시간축
8. **Finance/OPS/Sales Collaboration** — Account 360 통합

---

## 🧪 데모 시나리오 (25분 표준)

PRD §25.5.3 의 데모 흐름:

1. **(2분)** Dashboard — 오늘 처리할 항목 5초 내 파악
2. **(5분)** Inbox + Auto Case Creation
   - `/inbox` → 베트남 호텔 메일이 60초 내 케이스 생성
3. **(5분)** Hotel Chase 자동화
   - `/cases` → CASE-2026-05-3987 → AI 드래프트 + Approve & Send
4. **(4분)** Risk + Escalation
   - `/escalations` → CRITICAL 케이스의 다단계 트리
5. **(4분)** Finance & Credit
   - `/outstanding` → Aging Heatmap
   - `/credit` → 한도 초과 자동 hold + 결재
6. **(3분)** Audit + ROI
   - 케이스 1건의 audit log — 1분 재구성
7. **(2분)** 마무리: 90일 paid pilot 제안

---

## 📊 현재 상태 vs 풀 빌드

| 영역 | 프로토타입 | 풀 빌드 (12주 MVP) |
|---|---|---|
| 화면 | 16개 (mock data) | 30개 + 실제 데이터 |
| 백엔드 | ❌ | FastAPI + Postgres + pgvector + Celery |
| AI | ❌ (텍스트만) | 21 에이전트 (Claude + OpenAI fallback) |
| 통합 | ❌ | Gmail OAuth + Microsoft Graph + IMAP |
| 인증 | ❌ | NextAuth + JWT + MFA + RBAC |
| 보안 | ❌ | RLS + KMS + Audit + GDPR DPA |

본 프로토타입은 **디자인 파트너 인터뷰용 데모 / Figma 대체** 입니다.

---

## 📜 라이선스

Proprietary. © 2026 OpsCS. All rights reserved.
