# OpsCS — Session Changelog

> 본 저장소는 단일 PRD/명세 + 프로토타입의 누적 산출물입니다.

---

## 2026-05-02 — Initial Session

### Day 1 작업 요약

**6시간 세션 동안 완료한 산출물**:

#### 1. PRD (8 페이지 + 통합본 = 약 70K 단어)

| Page | 주제 | 분량 |
|---|---|---|
| 1 | Vision · Positioning · Naming · Scope · Modules | ~8K 단어 |
| 2 | Target Customers · Personas · Scenarios · Pain Map | ~9K 단어 |
| 3 | MVP · Feature Prioritization · 12-Week Roadmap | ~7K 단어 |
| 4 | Case Management · SOP Engine · SLA · Pseudocode | ~10K 단어 |
| 5 | AI Agents · Decision Logic · Risk Scoring · 12 Prompts | ~12K 단어 |
| 6 | Database · Architecture · API · Events · Security | ~10K 단어 |
| 7 | UI/UX · Dashboard · Analytics · 30 Screens | ~8K 단어 |
| 8 | Competitive · Pricing · GTM · Sales · Validation | ~9K 단어 |
| **통합** | 30 sections (Page 1~8 압축) | ~15K 단어 |

→ `docs/PRD.md` (통합본) + `docs/SPECIFICATION.md` (기술 명세) + `docs/ROADMAP.md` (실행 계획) 로 정리.

#### 2. Next.js 14 프로토타입 (16 화면)

| 화면 | 경로 | 핵심 |
|---|---|---|
| Dashboard | `/` | 14 KPI cards + Priority Queue + Active Escalations + Approval Queue |
| Inbox | `/inbox` | 케이스-그룹화된 메시지 + 언어 필터 |
| Cases | `/cases` | Saved Views + risk/priority/SLA 정렬 |
| **Case Detail** ★ | `/cases/[id]` | 4-region (헤더/좌측/중앙 timeline/우측) + AI Suggested Action + SOP Progress |
| Reservations | `/reservations` | 부킹 마스터 |
| Approvals | `/approvals` | AI 드래프트 + 결재 |
| Escalations | `/escalations` | ack/처리 큐 |
| Clients | `/clients` | 360 카드 + Credit utilization |
| Hotels | `/hotels` | 응답률/SLA/auto-send |
| Billing | `/billing` | Invoice + Status + Aging |
| Outstanding | `/outstanding` | Aging Heatmap + Risk Watchlist |
| Credit Control | `/credit` | Warning/Critical/Healthy 큐 |
| SOP Library | `/sop` | 16 SOP 템플릿 |
| Templates | `/templates` | 12 메일 템플릿 (다국어) |
| Analytics | `/analytics` | 13 위젯 |
| Settings | `/settings` | Workspace · Users · Integrations 등 |

**Tech Stack**: Next.js 14.2.35 + TypeScript + TailwindCSS + lucide-react

**Mock Data**: 10 cases · 8 hotels · 8 clients · 7 invoices · 3 escalations · 4 approvals · 16 SOPs · 12 templates

#### 3. 배포 인프라

- ✓ Git repo initialized + 2 commits
- ✓ Pushed to [github.com/bstars00-rgb/ops-cs](https://github.com/bstars00-rgb/ops-cs)
- ✓ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✓ GitHub Pages 자동 배포 활성화 완료
- **Live URL**: https://bstars00-rgb.github.io/ops-cs/

### 점수 평가 (Day 1 종료 시점)

| 영역 | 점수 | 변화 | 비고 |
|---|---|---|---|
| **QA** | 78/100 | — | 명세 명확도 9/10, e2e 테스트·평가셋 없음 |
| **개발** | 90/100 | +8 (프로토타입 빌드 후) | 실행 가능 코드 + 빌드 검증 + 배포 준비 |

**점수 ↑ 시키려면 (다음 우선순위)**:
1. golden eval set 100건 (LLM 정확도 측정) → QA +5
2. Playwright e2e 5개 (Page 2 시나리오 기반) → QA +4
3. OpenAPI YAML + Postman collection → 개발 +3
4. docker-compose.yml + .env.example → 개발 +2
5. GitHub Actions CI (lint + typecheck + test) → 개발 +2

### Commit 이력

```
267c20c ci: add GitHub Pages auto-deploy via Actions
be95dec feat: initial OpsCS prototype — 16 screens with mock data
```

### 다음 세션 권장 작업 (우선순위 순)

1. **디자인 파트너 인터뷰 시작** — 한국 호텔 도매상 4곳 컨택
2. **Golden eval set 작성** — LLM 정확도 측정용 100건 평가셋
3. **OpenAPI YAML 생성** — `docs/openapi.yaml` 으로 API 18 그룹 명세
4. **Docker compose 셋업** — 로컬 개발 환경 1일차 가능하게
5. **첫 SQL migration** — `db/migrations/0001_init.sql` 으로 50+ 테이블 생성
6. **AI 평가 harness** — Claude SDK 호출 + 평가셋 비교 + KPI 측정
7. **사용자 인터뷰 후 PRD 갱신** — Open Questions 19개 결정

---

## 다음 세션 시작 시 컨텍스트 회복

**프로젝트 위치**: `C:\Users\LENOVO\Desktop\OPs CS\`

**핵심 파일**:
- `docs/PRD.md` — 30 sections 통합 PRD
- `docs/SPECIFICATION.md` — 50+ DB 테이블 + 18 API 그룹 + 21 AI 에이전트
- `docs/ROADMAP.md` — 12주 + Phase 2 + 24개월
- `README.md` — 프로토타입 사용법
- `src/` — Next.js 16 화면

**저장소**: https://github.com/bstars00-rgb/ops-cs
**라이브 데모**: https://bstars00-rgb.github.io/ops-cs/

**MVP 헌법 (절대 어기지 않기)**:
1. 이메일 only · 호텔만 · 모든 외부 발송 사람 승인 · PMS/ERP 직접 연동 X · 단일 워크스페이스

**1차 ICP**: 한국·베트남 미드마켓 Hotel Reseller / DMC, GMV $20M~200M, OPS 15~120명, COO/오너 결재.
