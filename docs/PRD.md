# OpsCS — Product Requirements Document

> **AI Travel Operations OS for B2B 호텔/여행 운영**
> 호텔 부킹 CS · 공급선 추격 · 빌링 · 수금 · 미수 관리 · 신용 통제 · SOP 기반 에스컬레이션
>
> **버전**: v1.0 · **상태**: MVP-ready specification · **최종 갱신**: 2026-05-02

---

## 0. 문서 안내

본 PRD 는 다음 8개 페이지 작업의 통합본입니다:

| Page | 주제 | 본 문서 위치 |
|---|---|---|
| 1 | Vision · Positioning · Naming · Scope · Modules | §1~§7 |
| 2 | Target Customers · Personas · Scenarios · Pain Map | §4~§6 |
| 3 | MVP · Feature Prioritization · 12-Week Roadmap | §8~§9, §26 |
| 4 | Case Management · SOP Engine · SLA · Pseudocode | §10~§11 |
| 5 | AI Agents · Decision Logic · Risk Scoring · Prompts | §12~§13 |
| 6 | Database · Architecture · API · Events · Security | §17~§22 |
| 7 | UI/UX · Dashboard · Analytics · Screens | §20~§21 |
| 8 | Competitive · Pricing · GTM · Sales · Validation | §23~§25 |

상세 명세는 `docs/SPECIFICATION.md`, 로드맵은 `docs/ROADMAP.md` 참조.

---

## 1. Executive Summary

### 한 문장 정의

> **AI 에이전트가 호텔 추격·예약 매칭·다국어 응대·SOP 에스컬레이션을 자동 실행하고, 청구·미수·신용을 같은 케이스 위에서 추적하는 — B2B 호텔/여행 운영 조직(리셀러·도매·DMC·OTA)을 위한 운영 운영체제(Travel Operations OS).**

### 시장 기회

- **1차 ICP**: 한국·동남아 미드마켓 호텔 리셀러 + DMC. GMV $20M~200M, OPS·CS 인원 15~120명
- **TAM**: 한국 100~200사 + 일본 200~400사 + SEA 600~1,200사. ACV 평균 $80K → 연 $80M~120M ARR 가능
- **시장 공백**: Zendesk · Ada · Asksuite · Xero · Tesorio 어느 카테고리도 B2B 트래블 buyer-side 운영 통합 처리 X

### 왜 지금인가

1. LLM이 비정형 호텔 컨펌 메일을 95%+ 정확도로 파싱 (2026)
2. B2B 거래량 110~130% 회복 vs OPS 인원 70~85%만 복귀
3. DSO 45~75일로 악화, CFO 어젠다로 격상
4. 도매 마진 3~7% 압축, 자동화는 **이익 보존** 필수
5. 결정적 룰 + LLM 판단 혼합 SOP 가 처음으로 가능

### MVP 헌법 (5개 제약)

1. **이메일 only** (카톡·WhatsApp·전화는 Phase 2)
2. **호텔만** (항공·차량·투어는 Phase 3)
3. **모든 외부 발송 사람 승인** (자동 발송 0%, 야간 1차 follow-up 옵트인 예외)
4. **PMS·ERP 직접 연동 X** (CSV/이메일 통합으로 충분)
5. **단일 워크스페이스**

### 12주 후 핵심 메트릭

| 영역 | 목표 |
|---|---|
| 운영 | 컨펌 평균 시간 −30% / OPS 1인 시간 회수 ≥주 8h / Match 정확도 ≥85% |
| CS | FRT ≤4h / 회신 드래프트 채택률 ≥70% |
| 재무 | DSO −20% / AR 가시성 <5초 |
| AI | Issue 분류 정확도 ≥85% / 케이스당 LLM 비용 ≤$0.05 / 발송 사고 0건 |
| 사업 | Pilot 자발 갱신 ≥1곳 / Audit 완전성 100% |

---

## 2. Product Vision

### 카테고리

> **"Travel Operations OS (TravelOpsOS)"** — 새 카테고리 정의.

### Mission

호텔·여행 OPS 팀이 반복적인 추격·매칭·정산 추적에서 해방되도록, 기계가 잘하는 일은 기계가 하고, 사람은 **판단·관계·승인**에만 집중하게 한다.

### 3-Layer Value Proposition

| 레이어 | 가치 |
|---|---|
| **Time Recovery** | OPS 1인당 주 12~20시간 회수 |
| **Single Source of Truth** | 이메일/엑셀/메신저/PMS/PG 흩어진 데이터를 하나의 Case 위에 통합 |
| **Risk Visibility** | 미수, 신용한도, SLA, SOP 미실행을 사후가 아닌 발생 직전 표면화 |

### 차별화 (4-line)

| vs | 우리는 |
|---|---|
| 챗봇 | 답하지 않고 **실행** |
| 헬프데스크 | 티켓이 아니라 **부킹 라이프사이클** 운영 |
| CRM/회계 | 사후 기록이 아니라 **실시간 운영** |
| Hotel guest messaging | 호텔 측이 아니라 **호텔 buyer 측** |

---

## 3. Product Positioning

### Statement

> **"For** B2B 호텔·여행 운영 조직 that lose 40% of OPS capacity to manual chasing, reconciliation, and follow-up,
> **OpsCS** is the AI Travel Operations OS
> **that** unifies inquiry, reservation, supplier chase, billing, collection, credit, and SOP escalation on a single case spine.
> **Unlike** Zendesk(티켓), Salesforce(세일즈), Xero(사후 회계), or 자체 개발 CS툴,
> **our product** is the only system where **AI agents actually execute** the operations work — not advise on it."

### Pitches (요약)

- **8초**: "B2B 호텔 예약 OPS 의 모든 케이스를 — 문의부터 수금까지 — AI가 자동 추격·매칭·에스컬레이션해주는 운영 OS."
- **30초**: OPS 1인이 매일 5시간 쓰던 호텔 추격·예약 매칭·다국어 응대·미수 정리를 AI 에이전트가 자동화. 사람은 승인 버튼만 누름. OPS 1인당 주 8~12시간 회수.

### Website Headline

> **"AI가 운영하는 B2B 호텔 OPS의 운영체제"**

---

## 4. Target Customers

### 9 세그먼트 MVP 적합도

| Rank | 세그먼트 | 점수 | 비고 |
|---|---|---|---|
| 1 | **Hotel Reseller** (한국·SEA 미드) | **9/10** ★ | 비치헤드 #1 |
| 2 | **DMC** (한국 인바운드 대상) | 8/10 | 비치헤드 #2 |
| 3 | B2B Hotel Wholesaler (미드) | 7/10 | tail-ops 자동화 |
| 3 | Accommodation Booking Platform | 7/10 | 동일 제품 |
| 5 | Corporate Travel Agency | 6/10 | MICE 한정 |
| 5 | Hotel Sourcing | 6/10 | 그룹/MICE 한정 |
| 7 | OTA | 5/10 | 채널/OEM 후보 |
| 7 | Travel Agency | 5/10 | 호텔 사업부 한정 |
| 9 | Travel Tech Company | 3/10 | 파트너 후보 |

### Beachhead 정의

> **한국 또는 베트남 본사, 연 GMV $20M~200M, OPS·CS 인원 15~120명, COO/오너 결재, 직거래 호텔 비중 50%+ 의 Hotel Reseller / DMC.**
> 이 정의 외 거래는 **첫 24개월 거절** (resource preservation).

---

## 5. User Personas (12명 요약)

| # | 페르소나 | 핵심 목표 | 주 사용 화면 |
|---|---|---|---|
| 1 | OPS Agent (Sarah, 28) | 종업까지 모든 부킹 컨펌 | Inbox / Chase / Match Queue |
| 2 | CS Agent (Min-jung, 26) | FRT 4h + CSAT | Client Inbox / Account 360 |
| 3 | Reservation Operator (Hong, 35) | 부킹 정확도 100% | Reservation Detail / Group Manager |
| 4 | Finance Staff (Lee, 32) | DSO 단축 + 정합성 | AR Dashboard / Payment Match |
| 5 | Account Manager (Kim, 38) | 계정 매출 + 이탈 0 | Account 360 / Risk Watchlist |
| 6 | Sales Manager (Park, 42) | 신규 ARR + 한도 적정 | Credit Console |
| 7 | Procurement Manager (Han, 40) | 원가/응답률 | Supplier Console |
| 8 | Team Leader (Choi, 36) | 팀 SLA 95%+ | Team Dashboard / Escalation |
| 9 | Management/COO (Jang, 50) | EBITDA + 사고 0 | Executive Dashboard |
| 10 | B2B Client (외부) | 안정 컨펌 | Client Portal (Phase 2) |
| 11 | Hotel Contact (외부) | 정확 처리 + 정산 | (Email만) |
| 12 | Admin/IT (Suho, 33) | 무사고 운영 | Admin Console |

---

## 6. Core Problems

### 11 검증된 페인

1. 매일 50~150건 호텔 부킹 문의 — 모두 수기 분류·회신
2. 도매·직거래·DMC를 각각 **다른 채널로** 추격
3. 호텔이 24~72시간 무회신 — 누가 언제 다시 보낼지 결정 불가
4. CS·OPS·Finance가 **각자의 엑셀** 에서 작업
5. B2B 클라이언트 결제 50~90일 지연 — 어느 케이스에서 났는지 추적 불가
6. 신용 한도 미시스템화 → 한도 초과 부킹 받음
7. SOP가 PDF에 존재만 함
8. 에스컬레이션이 사후 발견
9. 동일 호텔/클라이언트 과거 분쟁이 케이스에 자동 인용 X
10. KR/EN/VN/JP/CN 메일 작성 1건당 5~15분
11. 감사 시 의사결정 흔적 재구성 불가

### Top 10 Pain (MVP P0/P1)

| Pain | 자동화 | 우선순위 |
|---|---|---|
| 호텔 컨펌 추격 | 95% | P0 |
| 비정형 컨펌 메일 매칭 | 90% | P0 |
| 다국어 응대 | 95% | P0 |
| 미수 가시성 | 80% | P0 |
| 부서별 다른 진실 | 100% | P0 |
| 감사 흔적 부재 | 100% | P0 |
| 야간 호텔 회신 → 컨펌 지연 | 95% | P0 |
| 신용한도 부킹 미연동 | 85% | P1 |
| SOP 미실행 | 80% | P1 |
| 에스컬레이션 사후 발견 | 80% | P1 |

---

## 7. Product Modules (13개)

| # | 모듈 | MVP |
|---|---|---|
| 1 | **Case Management (Spine)** | ✓ |
| 2 | **Hotel/Supplier Chase** | ✓ |
| 3 | **Reservation Matching** | ✓ |
| 4 | **Client Communication** | ✓ |
| 5 | **Billing & Invoice Tracking** | ✓ |
| 6 | **Payment Collection** | ✓ |
| 7 | **Outstanding Management** | ✓ |
| 8 | **Credit Control** | ✓ (경고만) / Phase 2 (자동 hold) |
| 9 | **SOP Automation** | ✓ (read-only) / Phase 2 (편집기) |
| 10 | **Escalation Management** | ✓ |
| 11 | **Dashboard & Analytics** | ✓ Basic / Phase 2 Advanced |
| 12 | **AI Agent Layer** (21 에이전트) | ✓ |
| 13 | **Audit Log** | ✓ |

---

## 8. MVP Scope

### Includes (10가지 핵심)

- 케이스 스파인 (생성/상태/링크/타임라인)
- Email 통합 (Gmail/Outlook OAuth + IMAP)
- AI 분류·매칭·다국어 드래프트 (KR/EN/VN/JP)
- Hotel Chase Agent (1·2·3차)
- **Human Approval Gate** (모든 외부 발송)
- SLA Timer + Chase Scheduler + Escalation Queue
- Invoice Tracking + Aging + Dunning Drafting
- Credit Limit Warning (경고만)
- SOP Library (read-only, 5~10개 사전 정의)
- Audit Log + Basic Dashboard (4 역할 뷰)

### Excludes (의도적 제외)

호텔 인벤토리/CRS · B2C 부킹 엔진 · 채널 매니저 · 정식 회계 GL · 자체 PG · 챗봇 UI · 모바일 네이티브 앱 · 멀티테넌트 거버넌스 · 자동 SOP 생성 · 예측 ML

### Boundaries (Scope Creep 방지선)

1. "케이스가 아니면 우리 일이 아니다"
2. "우리는 돈을 옮기지 않는다, 워크플로우를 오케스트레이션한다"
3. "PMS/CRS/회계를 대체하지 않는다, 위에 얹힌다"
4. "챗봇은 우리가 아니다 — 모든 AI 액션은 Case 위에서 사람 승인/감사 가능"
5. "트래블 외 도메인은 18개월 동안 안 한다"

---

## 9. Feature Requirements (요약)

상세 23 P0 + 12 Should-Have + 13 Future 는 [`docs/SPECIFICATION.md`](./SPECIFICATION.md) 참조.

### Top 10 P0 (가장 중요한 10개)

1. Email Inbox Integration (Gmail/Outlook/IMAP)
2. Email-to-Case Creation
3. Case Status Tracking (35 statuses)
4. Reservation Matching (LLM + 벡터)
5. AI Hotel Inquiry / Client Reply / Collection Drafting
6. Human Approval Gate
7. SLA Timer + Chase Scheduler
8. Outstanding Tracking (Aging Bucket)
9. Escalation Queue
10. Audit Log

---

## 10. Case Management Workflow

### Case 정의

> **"다중 당사자의 시간 축 위에 놓인, 상태를 가진 단일 운영 단위"**

### 18 Case Types

상세 [`docs/SPECIFICATION.md` §3.1](./SPECIFICATION.md) 참조.

핵심: BOOKING_CONFIRMATION / HOTEL_CANNOT_FIND_RESERVATION / URGENT_CHECKIN_ISSUE / OVERBOOKING / CANCELLATION / REFUND / NO_SHOW_DISPUTE / PAYMENT_OVERDUE / CREDIT_LIMIT_WARNING / VIP_COMPLAINT 등.

### 35 Statuses (8 그룹)

| Group | Statuses |
|---|---|
| A. Intake | NEW |
| B. AI Processing | AI_REVIEWING, DATA_MATCH_NEEDED |
| C. Data Resolution | RESERVATION_MATCHED, NEED_MORE_INFO_FROM_CLIENT |
| D. Pre-Send | HOTEL_CONFIRMATION_REQUIRED, HOTEL_INQUIRY_DRAFTED, WAITING_FOR_HUMAN_APPROVAL |
| E. Outbound | HOTEL_CONTACTED, SUPPLIER_CONTACTED |
| F. Waiting | WAITING_FOR_HOTEL/SUPPLIER/CLIENT |
| G. Chase | FIRST_CHASE_SENT, SECOND_CHASE_SENT |
| H. Billing | INVOICE_SENT, PAYMENT_PENDING, DUE_SOON, DUE_TODAY |
| I. Overdue | OVERDUE_D1/D3, FIRST/SECOND_PAYMENT_REMINDER_SENT |
| J. Finance Review | FINANCE_REVIEWING |
| K. Credit | CREDIT_LIMIT_WARNING/EXCEEDED |
| L. Hold/Approval | BOOKING_HOLD_RECOMMENDED, MANAGER_APPROVAL_REQUIRED |
| M. Escalation | ESCALATED_TO_HUMAN/MANAGER |
| N. Terminal | RESOLVED, CLOSED, REOPENED, FAILED_UNRESOLVED |

---

## 11. SOP Automation Engine

### Step Types (7개)

`AI_ACTION` / `AUTO_ACTION` / `NOTIFY` / `WAIT` / `APPROVAL` / `BRANCH` / `STATUS_CHANGE | CLOSE`

### 16 SOP Templates

| SOP | 트리거 |
|---|---|
| SOP_HOTEL_NO_RESPONSE | WAITING_FOR_HOTEL + SLA 초과 |
| SOP_SUPPLIER_NO_RESPONSE | WAITING_FOR_SUPPLIER + SLA |
| SOP_URGENT_CHECKIN | P0 분류 |
| SOP_HOTEL_NO_RECORD | "no record" 분류 |
| SOP_OVERBOOKING | "overbooked" 분류 |
| SOP_REFUND_REQUEST | type=REFUND |
| SOP_NO_SHOW_DISPUTE | type=NO_SHOW_DISPUTE |
| SOP_CANCELLATION_FEE_DISPUTE | 분쟁 |
| SOP_CLIENT_PAYMENT_OVERDUE | 만기 D+1 |
| SOP_INVOICE_DUE_SOON | 만기 D-7 |
| SOP_CREDIT_LIMIT_EXCEEDED | utilization ≥1.0 |
| SOP_NEW_BOOKING_WITH_OUTSTANDING | 신규+60+ 미수 |
| SOP_PARTIAL_PAYMENT | 입금 < Invoice |
| SOP_PAYMENT_PROOF_MISMATCH | 증빙 ≠ Invoice |
| SOP_SALES_OVERRIDE_REQUEST | 신용 hold 우회 |
| SOP_VIP_COMPLAINT | VIP + 분노 |

상세 step / SLA / escalation 룰은 `docs/SPECIFICATION.md` §5 참조.

---

## 12. AI Agent Architecture

### 21 에이전트 (4 레이어)

| 레이어 | 에이전트 |
|---|---|
| **INTAKE** (1~7) | Email Intake / Language Detection / Translation / Sender Identification / Reservation Matching / Issue Classification / Hotel Policy |
| **EXECUTION** (8~17) | Hotel Inquiry Drafting / Supplier Inquiry Drafting / Client Reply Drafting / Collection Reminder Drafting / Billing Status / Payment Matching / Outstanding Detection / Credit Risk / Follow-up·Chase / SOP Execution |
| **DECISION** (18~19) | Risk Detection / Escalation |
| **QUALITY** (20~21) | QA / Analytics |

### Risk Scoring (0~100)

**Hard Triggers** → 즉시 CRITICAL: LEGAL_KEYWORD / URGENT_CHECKIN / VIP_COMPLAINT / OVERBOOKING_DAY_OF / CRITICAL_AGING / MEDIA_RISK / EXEC_REQUEST

**Soft Factors** (총합 100): Urgency 15 / Tier 10 / Value 10 / Payment 10 / Outstanding 10 / Credit 10 / Sentiment 10 / Refund 10 / Check-in proximity 15 / Hotel delay 5 / AI conf 5 / History 5

**Bands**: LOW 0-24 / MEDIUM 25-49 / HIGH 50-74 / CRITICAL 75-100

상세 12 production prompts 는 `docs/SPECIFICATION.md` §6 참조.

---

## 13. Human Approval Logic

### Auto-Send Hard Gate (12 가드)

risk=LOW + confidence ≥0.90 + approved template + no refund/comp/legal + no credit hold + not VIP + no dispute + no PII risk + send window + recipient cooldown 1h + per-case cap 2 → 모두 통과 시만 자동 발송.

### Mandatory Human Approval (15가지)

환불 / 보상 / 법적 위협 / VIP / 분노 톤 / 긴급 체크인 / 오버부킹 / 결제 분쟁 / 한도 초과 / Booking hold / Sales 우회 / Finance 결재 / Write-off / 낮은 AI 신뢰도 / 매칭 실패

### 10 Hard Safety Rules (절대 금지)

상세 `docs/SPECIFICATION.md` §6.2 참조. 모두 코드 레벨 결정적 가드 강제.

---

## 14~16. Billing / Outstanding / Credit Modules

### Billing 핵심

- Dunning 5단계 톤: D-7 gentle → D-1 courteous → D+1 polite_firm → D+3/D+7 firm → D+14/D+30 final_notice
- Payment Matching: EXACT / PARTIAL / OVERPAY / MULTI_INVOICE / AMBIGUOUS / NONE
- Tolerance: ±0.5% (FX 노이즈)

### Outstanding 핵심

- Aging Bucket: 0-30 / 31-60 / 61-90 / 90+ (영업일 기준)
- Materialized View 일배치 갱신
- D+30 → Sales Manager / D+60 → Finance Manager / D+90 → COO

### Credit Control 핵심

- utilization < 0.8 → OK / 0.8-1.0 → WARNING / ≥1.0 → BLOCK 자동 hold
- Risk Modifier: Aging 60+ / disputed >5% / 신규 계정 <6mo → 한 단계 격상
- Approval Chain: Sales Mgr → Sales+Finance Mgr → COO

---

## 17~19. Database / Architecture / API (요약)

### 50+ DB Tables, 14 도메인

Identity / Tenancy · Client · Supplier · Reservation · Billing & Payment · Case & Workflow · Approval · SLA / Chase / Escalation · SOP · AI Layer · Communication · Templates · Integrations · Audit & Analytics · Holidays.

상세 ERD + 인덱스 + RLS 는 `docs/SPECIFICATION.md` §1~2 참조.

### Tech Stack

| 컴포넌트 | 선택 |
|---|---|
| Frontend | Next.js 14 + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Python 3.12 + FastAPI + Pydantic v2 + SQLAlchemy 2.0 |
| Database | PostgreSQL 16 + pgvector + RLS |
| Queue | Celery + Redis |
| Email | Gmail API + Microsoft Graph + IMAP/SMTP + AWS SES |
| AI | Anthropic Claude SDK (primary) + OpenAI (fallback) |
| Hosting | (MVP) Vercel + Supabase → (Year 1+) AWS ECS Fargate |

### REST API (18 그룹, 100+ 엔드포인트)

상세 OpenAPI 명세는 `docs/SPECIFICATION.md` §3 참조.

---

## 20. UI/UX Summary

### 13 Navigation 메뉴

Dashboard / Inbox / Cases / Reservations / Approval Queue / Escalations / Clients / Hotels & Suppliers / Billing / Outstanding / Credit Control / SOP Library / Templates / Analytics / Settings.

### 30 화면 (프로토타입은 16개 구현)

상세 화면 명세는 `docs/SPECIFICATION.md` §4 참조.

### 8 UX Principles

1. OPS Speed First — 키보드 단축키, 1클릭 완결
2. Clear Next Action — "AI Suggested Next Action" 카드
3. One Case, One Truth — 모든 부서 동일 화면
4. Human Approval Visibility — 승인자 라벨, AI 워터마크
5. Risk-First Prioritization — 큐 디폴트 정렬: risk → priority → SLA
6. No Hidden AI Action — 모든 AI 액션 timeline + Why?
7. Timeline-Based Accountability — 사람·AI·시스템 같은 시간축
8. Finance/OPS/Sales Collaboration — Account 360 통합

---

## 21. Dashboard & Analytics

### 14 KPI Cards

Total Open Cases / New Today / Waiting Hotel / Waiting Supplier / Urgent Check-in / Overdue / SLA Breach 24h / Payment Overdue Sum / Clients Over Limit / Booking Hold Recommended / Avg Resolution / Hotel Avg Response / AI Draft Acceptance / My Approval Queue.

### 13 Analytics Widgets

Cases by Type / Client / Hotel / Supplier / Language / SLA Trend / Hotel No-Response Ranking / Aging Heatmap / Credit Utilization / Collection Funnel / AI Confidence / Human Intervention / SOP Completion.

---

## 22. Security & Compliance

### 14 보안 영역

Multi-Tenant Isolation (3중) · RBAC · TLS 1.3 · AES-256 + KMS · Secrets · PII Masking · Guest Data Protection · Email Access · API Keys · Audit Logging · Access Logs · Data Retention · AI Action Logging · Human Approval Mandatory.

### Compliance Roadmap

| 단계 | 목표 |
|---|---|
| MVP | 한국 PIPA + DPA |
| Phase 2 | SOC 2 Type I 준비 |
| Phase 3 | SOC 2 Type II + GDPR + pen test |
| Enterprise | ISO 27001 + 베트남 PDPL + 일본 APPI |

---

## 23. Competitive Analysis

### 5 카테고리 vs 차별화

| 카테고리 | 한계 | 우리 |
|---|---|---|
| Helpdesk (Zendesk/Intercom) | B2C 티켓 모델 | 부킹 라이프사이클 |
| AI 응대 (Ada/Sierra) | B2C SaaS 응대 | 트래블 vertical 실행 |
| Hotel Tech (Asksuite/HiJiffy) | 호텔 sell-side | 호텔 buyer-side |
| PMS/CRS (Cloudbeds/SiteMinder) | 호텔 자체 | buyer 위에 |
| Accounting (Xero/Tesorio) | 사후 / Finance only | 운영 + AR 통합 |

**가장 큰 경쟁자 = Excel + Email** (시장 80%).

---

## 24. Pricing Strategy

### 4-Tier (Hybrid: Base + Seat + AI Cap)

| 티어 | 월 가격 | 시트 | AI Cap |
|---|---|---|---|
| Starter | $890 | 5 | 500/mo |
| **Growth ★** | $2,890 | 15 | 2,500/mo |
| Pro | $6,490 | 40 | 8,000/mo |
| Enterprise | $120K~600K ACV | 협상 | ∞ |

### Pilot Pricing

- Lighthouse Design Partner (1~2곳): **무상 12주** + 데이터/로고 권리
- Paid Pilot: **$2,500/mo flat × 90일**

---

## 25. GTM Strategy

### Beachhead

한국 + 베트남 미드마켓 호텔 리셀러 + DMC. COO/오너 결재. 직거래 호텔 비중 50%+.

### First 10 Customers Plan (24개월)

| 트랙 | 채널 | 목표 |
|---|---|---|
| Founder Network | 창업자 인맥 | 1~2 디자인 파트너 (M0~M3) |
| Targeted Outbound | LinkedIn + Email | 5~7 paid pilot (M4~M12) |
| Conferences | PATA / HSMAI / ITB Asia / Korea Travel Forum | 2~3 lead-to-pilot (M6~M24) |
| Channel | PMS/CRS · ERP · 컨설턴시 | 보조 (Phase 2) |

---

## 26~27. Roadmap

상세 12주 + Phase 2 + 24개월 로드맵은 [`docs/ROADMAP.md`](./ROADMAP.md) 참조.

### 12주 후 출시 게이트 (3개 모두 충족)

1. **G1. 가치**: OPS 1인 시간 회수 ≥주 5h + 컨펌 평균 −20%
2. **G2. 안전**: Critical 발송 오류 0건 + Audit 완전성 100%
3. **G3. 신뢰**: Pilot 1곳 이상 자발 갱신 의사

---

## 28. Risks and Mitigation (Top 8)

| # | Risk | 가능성 | 영향 | 완화 |
|---|---|---|---|---|
| R1 | AI 오발송 신뢰 리스크 | 중 | 매우 큼 | 100% Human-approve, 결정적 가드, QA Agent |
| R2 | 데이터 통합 복잡도 | 높 | 큼 | 1차 ICP 한국·SEA 집중, 50K+ 평가셋 |
| R3 | 부서 사일로 정치 | 중 | 큼 | OPS 단일 wedge, 점진 확장 |
| R4 | 공급선 비협조 | 중 | 중 | 24개월 직거래·중소 우선 |
| R5 | AI 정확도 임계 | 중 | 큼 | 도메인 평가셋, 사람 override 학습 |
| R6 | 인재 채용 (Python+AI) | 중 | 중 | 작은 팀 5~6, 외주 X |
| R7 | LLM 비용 폭주 | 중 | 중 | 케이스당 cap, caching, fallback |
| R8 | 경쟁자 진입 | 중 | 큼 | 데이터 모트, 디자인 파트너 lock-in |

---

## 29. Open Questions

19개 미결 질문은 별도 RAID 로그 관리. 핵심:

1. 단일 vs 다중 워크스페이스 정책
2. 베트남어 PDF OCR 정확도 (W3 검증)
3. SOP 충돌 처리 우선순위
4. Pilot 무상 vs Paid $2,500 어느 쪽이 commit 강한가
5. 베트남 진출 시점 (M3 vs M9)
6. Region pinning 정책
7. AI 발송 메일의 책임 소재 (DPA)
8. 첫 채용 우선순위 (AI vs 풀스택)

---

## 30. Final Recommendation

### 즉시 실행 (Day 0~30)

1. 인터뷰 10건 (한국 4 + DMC 2 + 베트남 2 + 일본 1 + 액센트 1)
2. 클릭 가능 Figma + 5분 데모 영상 (7개 핵심 화면)
3. 디자인 파트너 LOI 1~2장 확보

**Decision Gate (Day 30)**: 페인 일치 ≥7명 + WTP $2K+ ≥4명 + LOI 1~2장 → 빌드 시작.

### 12주 빌드 (Day 30~120)

MVP 헌법 5개 절대 어기지 않고, [`docs/ROADMAP.md`](./ROADMAP.md) 의 주차별 계획 그대로.

### 한 줄 결론

> **"이 PRD는 12주 안에 1곳, 24개월 안에 25곳을 만든다는 약속이다. 그 외의 모든 활동은 distraction이다."**

---

## 부록: 24-Month Vision

| 시점 | 마일스톤 |
|---|---|
| M3 | MVP 출시 + 디자인 파트너 1~2곳 |
| M6 | Phase 2 시작, 4곳 paid |
| M9 | 6곳 paid, $50K MRR |
| M12 | 8곳 paid, $80K~120K MRR, SOC 2 Type I 시작 |
| M18 | 12~15곳 paid, 베트남 진출, $200K MRR |
| M24 | 20~25곳 paid, 일본 첫 deal, $400K~600K MRR, Series A 가능 |
