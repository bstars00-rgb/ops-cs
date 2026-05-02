# OpsCS — Technical Specification

> **빌드 가능한 기술 명세** — DB 스키마, API 계약, AI 에이전트, SOP, 보안.
> 본 문서의 정의는 그대로 SQL migration / OpenAPI YAML / LLM prompt 의 입력입니다.

---

## 0. 표준 컨벤션

- **PK**: 모든 테이블 `id uuid` (UUID v7, 시간 정렬)
- **Tenancy**: 모든 테이블 `workspace_id uuid NOT NULL` + Postgres RLS
- **Timestamps**: 모든 테이블 `created_at`, `updated_at` (timestamptz, default now())
- **Soft delete**: `deleted_at timestamptz NULL` (필요 테이블만)
- **JSON**: 가변 필드는 `meta jsonb`, 인덱싱 시 `GIN(meta)`
- **Identifiers**: 사람 식별용 `code varchar(20-40)` (예: `CASE-2026-05-3987`, `INV-2026-04-998`)

---

## 1. Database Schema (50+ Tables)

### 1.1 Identity & Tenancy

#### `workspaces`
- `id`, `name varchar(120)`, `slug varchar(60) UNIQUE`, `plan varchar(20)`, `primary_language varchar(5)`, `supported_languages varchar[]`, `timezone varchar(40)`, `settings jsonb`, `status varchar(20)`

#### `users`
- `id`, `workspace_id (FK)`, `email varchar(254)`, `name varchar(120)`, `role_id (FK)`, `team_id (FK NULL)`, `oauth_provider`, `oauth_subject`, `password_hash`, `mfa_secret`, `status`, `last_login_at`, `settings jsonb`
- INDEX: `UNIQUE(workspace_id, email)`, `(workspace_id, status)`

#### `roles`
- `id`, `workspace_id`, `code varchar(40)` (OPS/CS/FINANCE/LEADER/ADMIN), `name`, `permissions varchar[]`, `is_system bool`

#### `teams`
- `id`, `workspace_id`, `name`, `manager_user_id (FK)`, `settings jsonb`

### 1.2 Client Domain

#### `clients`
- `id`, `workspace_id`, `code varchar(40)`, `name varchar(200)`, `domains varchar[]`, `country varchar(2)`, `tier varchar(20)` (VIP/Premium/Standard/Trial), `language`, `timezone`, `account_owner_id (FK)`, `sales_owner_id (FK)`, `status`, `account_age_months int`, `meta jsonb`
- INDEX: `(workspace_id, status)`, `GIN(domains)`, `(workspace_id, account_owner_id)`

#### `client_contacts`
- `id`, `workspace_id`, `client_id (FK)`, `name`, `email`, `phone`, `role`, `language_pref`, `is_primary`, `status`

#### `client_payment_terms`
- `id`, `client_id (FK)`, `terms_type` (NET/PREPAID/DEPOSIT/ON_DEMAND), `net_days int`, `deposit_pct numeric(5,2)`, `currency varchar(3)`, `effective_from date`, `effective_to date NULL`, `created_by`
- INDEX: `(client_id, effective_from desc)`

### 1.3 Supplier Domain

#### `hotels`
- `id`, `workspace_id`, `code`, `name`, `address`, `city`, `country`, `timezone`, `language`, `sla_response_seconds int`, `auto_send_allowed bool`, `business_hours jsonb`, `holidays_calendar`, `response_stats jsonb` (cached: avg_seconds, last_30d_rate), `room_type_mapping jsonb`, `meta jsonb`
- INDEX: `UNIQUE(workspace_id, code)`, `(workspace_id, country)`, `GIN(meta)`

#### `hotel_contacts`, `hotel_policies`, `suppliers`, `supplier_contacts`
- 동일 패턴

### 1.4 Reservation Domain

#### `reservations`
- `id`, `workspace_id`, `code`, `client_id (FK)`, `hotel_id (FK)`, `supplier_id (FK NULL)`, `status varchar(30)` (DRAFT/PENDING_CONFIRM/CONFIRMED/CANCELED/STAYED/COMPLETED/FAILED), `check_in date`, `check_out date`, `nights int`, `nationality varchar(2)`, `total_amount numeric(14,2)`, `currency varchar(3)`, `commission_amount`, `net_amount`, `sale_amount`, `hotel_confirmation_no varchar(80)`, `client_reference`, `source varchar(20)`, `confirmed_at`, `canceled_at`, `meta jsonb`
- INDEX: `UNIQUE(workspace_id, code)`, `(workspace_id, client_id, check_in desc)`, `(workspace_id, hotel_id, check_in)`, `(workspace_id, status)`, `(workspace_id, hotel_confirmation_no)`

#### `reservation_guests`, `reservation_rooms`
- 표준 자식 테이블

### 1.5 Billing & Payment

#### `invoices`
- `id`, `workspace_id`, `code`, `client_id (FK)`, `status varchar(20)` (DRAFT/SENT/VIEWED/PAID/PARTIAL/DISPUTED/VOID), `subtotal`, `tax`, `total numeric(14,2)`, `currency`, `issue_date`, `due_date`, `paid_amount`, `balance numeric(14,2)`, `aging_bucket varchar(10)`, `paid_at`, `disputed_at`, `dispute_reason`, `erp_reference varchar(80)`, `pdf_url`, `meta jsonb`
- INDEX: `(workspace_id, client_id, status)`, `(workspace_id, due_date) WHERE status IN ('SENT','VIEWED','PARTIAL')`, `(workspace_id, aging_bucket)`

#### `invoice_items`, `payments`, `payment_allocations`, `payment_proofs`
- 표준 패턴

#### `outstanding_balances` (Materialized View)
- `workspace_id`, `client_id`, `currency`, `total_outstanding`, `bucket_0_30`, `bucket_31_60`, `bucket_61_90`, `bucket_90_plus`, `oldest_invoice_id`, `computed_at`

#### `credit_limits`, `credit_exposure_logs`, `booking_hold_rules`

### 1.6 Case & Workflow (Core)

#### `cases` ★
| 필드 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| workspace_id | uuid | FK |
| code | varchar(20) | UNIQUE 'CASE-2026-05-3987' |
| type | varchar(40) | 18 types |
| status | varchar(40) | 35 statuses |
| previous_status | varchar(40) | |
| priority | varchar(10) | P0/P1/P2/P3 |
| owner_id | uuid | FK→users |
| client_id | uuid | FK |
| hotel_id | uuid | FK NULL |
| supplier_id | uuid | FK NULL |
| primary_reservation_id | uuid | FK NULL |
| primary_invoice_id | uuid | FK NULL |
| parent_case_id | uuid | FK→cases |
| caused_by_case_id | uuid | FK→cases |
| thread_id | varchar(255) | 메일 thread |
| source | varchar(20) | EMAIL/MANUAL/API/SYSTEM |
| risk_score | int | 0-100 |
| risk_band | varchar(10) | LOW/MEDIUM/HIGH/CRITICAL |
| sla_target_seconds | int | |
| sla_started_at | timestamptz | |
| sla_breached_at | timestamptz | |
| sla_paused_total_seconds | int | default 0 |
| sla_paused_at | timestamptz | |
| escalation_level | int | default 0 |
| ai_summary | text | |
| meta | jsonb | |
| resolved_at, closed_at, reopened_at | timestamptz | |

**INDEX**:
- `UNIQUE(workspace_id, code)`
- `(workspace_id, status, owner_id)` — 큐
- `(workspace_id, priority, status, created_at desc)` — 우선순위
- `(workspace_id, type, created_at desc)`
- `(workspace_id, client_id, created_at desc)`
- `(thread_id) WHERE thread_id IS NOT NULL`
- `(workspace_id, sla_breached_at) WHERE sla_breached_at IS NOT NULL`
- `GIN(meta)`

#### `case_status_history`, `case_messages`, `case_tasks`, `case_reservation_links`
- `case_messages`: direction ∈ INBOUND/OUTBOUND/INTERNAL_NOTE, channel, thread_id, sent_status

### 1.7 Approval / Workflow

#### `approval_requests`
- `id`, `workspace_id`, `case_id`, `target_kind` (DRAFT_SEND/REFUND/WRITE_OFF/CREDIT_HOLD_OVERRIDE/LIMIT_INCREASE), `target_ref_id`, `requester_user_id`, `approver_user_ids uuid[]`, `approval_chain jsonb`, `current_level`, `status` (PENDING/APPROVED/REJECTED/EXPIRED/CANCELED), `decision_payload jsonb`, `decided_by`, `decided_at`, `deadline_at`, `reason`, `ai_recommendation jsonb`

### 1.8 SLA / Chase / Escalation

#### `sla_rules`, `sla_timers`
#### `chase_rules`, `chase_jobs`
#### `escalation_rules`, `escalations`

### 1.9 SOP

#### `sop_templates`
- `id`, `workspace_id`, `code`, `name`, `version int`, `applies_to jsonb`, `enabled bool`, `latest bool`, `spec jsonb` (full DSL), `created_by`, `published_at`, `supersedes_id`

#### `sop_executions`, `sop_execution_logs`

### 1.10 AI Layer

#### `ai_decisions`
| 필드 | 타입 |
|---|---|
| id | uuid |
| workspace_id | uuid |
| case_id | uuid FK NULL |
| agent | varchar(40) |
| model | varchar(60) |
| input_payload | jsonb (redacted) |
| output_payload | jsonb |
| confidence | numeric(4,3) |
| escalation_signals | text[] |
| latency_ms | int |
| input_tokens, output_tokens | int |
| cost_usd_micro | int |
| status | varchar(20) |

#### `drafts`
- `id`, `case_id`, `kind`, `language`, `tone_used`, `subject`, `body_text`, `recipient_addrs text[]`, `generated_by_decision_id (FK)`, `status` (PENDING/APPROVED/REJECTED/EXPIRED/SENT), `approved_by`, `edits jsonb`

### 1.11 Communication

#### `email_accounts`, `email_threads`, `email_messages`, `attachments`

### 1.12 Audit & Analytics

#### `audit_logs` (월별 partition, append-only)
- `id`, `workspace_id`, `at timestamptz` (partition key), `actor_user_id`, `actor_kind` (USER/AI_AGENT/SOP/CRON/INTEGRATION), `action varchar(80)`, `target_kind`, `target_id`, `ip inet`, `user_agent`, `diff jsonb`, `metadata jsonb`
- INDEX (per partition): `(workspace_id, at desc)`, `(target_kind, target_id, at desc)`, `(actor_user_id, at desc)`, `(action, at desc)`
- 90일 후 → S3 cold archive (Object Lock)

---

## 2. State Machine

### 2.1 Status Transition Rules

```python
ALLOWED_TRANSITIONS: dict[Status, set[Status]] = {
    Status.NEW: {Status.AI_REVIEWING, Status.DATA_MATCH_NEEDED},
    Status.AI_REVIEWING: {
        Status.RESERVATION_MATCHED,
        Status.DATA_MATCH_NEEDED,
        Status.NEED_MORE_INFO_FROM_CLIENT,
    },
    Status.RESERVATION_MATCHED: {
        Status.HOTEL_CONFIRMATION_REQUIRED,
        Status.SUPPLIER_CONFIRMATION_REQUIRED,
        Status.RESOLVED,
    },
    # ... (full table in Page 4 §3)
    Status.RESOLVED: {Status.CLOSED, Status.REOPENED},
    Status.CLOSED: {Status.REOPENED},
}

PAUSE_SLA_STATUSES = {
    Status.WAITING_FOR_CLIENT,
    Status.NEED_MORE_INFO_FROM_CLIENT,
    Status.MANAGER_APPROVAL_REQUIRED,
}
```

### 2.2 핵심 흐름 3개

**부킹 컨펌**:
```
NEW → AI_REVIEWING → RESERVATION_MATCHED → HOTEL_CONFIRMATION_REQUIRED 
→ HOTEL_INQUIRY_DRAFTED → WAITING_FOR_HUMAN_APPROVAL → HOTEL_CONTACTED 
→ WAITING_FOR_HOTEL → (응답) AI_REVIEWING → RESOLVED
→ (무응답) FIRST_CHASE_SENT → SECOND_CHASE_SENT → ESCALATED_TO_HUMAN
```

**수금**:
```
INVOICE_SENT → PAYMENT_PENDING → DUE_SOON → DUE_TODAY → OVERDUE_D1
→ FIRST_PAYMENT_REMINDER_SENT → OVERDUE_D3 → SECOND_PAYMENT_REMINDER_SENT
→ ESCALATED_TO_MANAGER → FINANCE_REVIEWING → RESOLVED 또는 FAILED_UNRESOLVED
```

**신용**:
```
(신규 부킹) → CREDIT_LIMIT_WARNING / CREDIT_LIMIT_EXCEEDED
→ BOOKING_HOLD_RECOMMENDED → MANAGER_APPROVAL_REQUIRED → 결정
```

---

## 3. REST API (18 그룹)

### 3.1 표준

```
Base URL: https://api.{tenant}.platform.com/v1
Auth: Authorization: Bearer <jwt>
      X-Workspace-Id: <ws_id>
Pagination: ?cursor=...&limit=50
Response: { data, meta } | { error: { code, message, details } }
Headers: X-Request-Id, X-Rate-Limit-Remaining
```

### 3.2 엔드포인트 카탈로그

| 그룹 | 핵심 엔드포인트 |
|---|---|
| **Auth** | POST /auth/login, /oauth/{provider}/callback, /refresh, /mfa/verify |
| **Users / Roles** | GET/POST /users, /roles |
| **Clients** | GET/POST /clients, /{id}/payment-terms, /credit-limit, /outstanding, /cases |
| **Reservations** | GET/POST /reservations, /import, /{id}/cancel, /match |
| **Hotels / Suppliers** | GET/POST /hotels, /{id}/contacts, /{id}/policies |
| **Cases** ★ | GET/POST /cases, /{id}/transition, /notes, /tasks, /link-reservation, /escalate, /close, /reopen |
| **Messages / Drafts** | GET /cases/{id}/messages, POST /cases/{id}/draft, /drafts/{id}/approve-send, /edit, /reject |
| **Invoices / Payments** | GET/POST /invoices, /{id}/send, /void, /dispute, /payments, /{id}/allocate, /match, /payment-proofs |
| **Outstanding / Credit** | GET /outstanding, /credit-limits/exposures, POST /credit-checks |
| **SOP / SLA / Escalation** | /sop-templates, /sop-executions/{id}/resume, /sla-rules, /escalations/{id}/acknowledge |
| **AI Actions** | POST /ai/intake, /match-reservation, /classify, /draft, /risk-score, /qa, GET /ai/decisions |
| **Approvals** | GET /approvals, POST /{id}/approve, /reject, /delegate, /conditional |
| **Analytics** | GET /analytics/kpi, /team-load, /hotels/{id}/scorecard, /clients/{id}/scorecard, /aging |
| **Admin** | /integrations, /email-accounts, /templates, /webhooks, /audit-logs, /admin/usage |

### 3.3 핵심 요청/응답 예시

**`POST /cases/{id}/draft`**
```json
{
  "intent": "HOTEL_INQUIRY",
  "tone_index": 2,
  "language": "en",
  "attach_evidence": true
}
```
Response:
```json
{
  "data": {
    "draft_id": "drf_abc",
    "subject": "[2nd Reminder] Confirmation request BKG-...",
    "body": "Dear ABC Hotel...",
    "confidence": 0.93,
    "risk_signals": [],
    "reasoning": "Tone 2 적용..."
  }
}
```

**`POST /credit-checks`**
```json
{ "client_id": "clt_...", "new_booking_amount": 4800, "currency": "USD" }
```
Response:
```json
{
  "data": {
    "utilization_pct": 1.18,
    "risk_band": "CRITICAL",
    "recommendation": "BLOCK",
    "case_id": "case_...",
    "approval_chain_required": ["sales_manager", "finance_manager"]
  }
}
```

---

## 4. Event System (30+ Events, Outbox Pattern)

### 4.1 Schema

```json
{
  "event_id": "01HZX...",
  "event_name": "case.status_changed",
  "schema_version": 1,
  "workspace_id": "ws_...",
  "occurred_at": "2026-05-04T03:21:00Z",
  "data": { ... }
}
```

### 4.2 핵심 이벤트

`email.received` · `case.created` · `case.status_changed` · `case.assigned` · `reservation.matched` · `hotel.inquiry.sent` · `chase.due` · `chase.sent` · `sla.threshold` · `sla.breached` · `invoice.due_soon` · `invoice.due_today` · `payment.overdue` · `payment.received` · `payment.matched` · `payment.partial` · `payment.proof.uploaded` · `credit.limit_warning` · `credit.limit_exceeded` · `booking.hold_recommended` · `approval.requested` · `approval.approved` · `approval.rejected` · `escalation.triggered` · `escalation.acknowledged` · `case.resolved` · `case.closed` · `case.reopened` · `ai.decision.completed` · `audit.recorded`

### 4.3 Outbound Webhook

- HMAC-SHA256 서명 (`X-Signature`, `X-Timestamp`)
- 재시도: 지수 백오프 5회, 24h 후 deadletter
- 응답 2xx 만 성공

---

## 5. SOP DSL (16 SOP Templates)

### 5.1 SOP 구조

```yaml
sop:
  id: SOP_HOTEL_NO_RESPONSE
  version: 3
  applies_to: [SUPPLIER_DELAY, BOOKING_CONFIRMATION]
  trigger: { type: status_entered, value: WAITING_FOR_HOTEL }
  preconditions:
    - case.hotel_id is not null
    - now() - last_contact_at > hotel.sla_response_seconds
  steps:
    - { id, type: AI_ACTION|AUTO_ACTION|NOTIFY|WAIT|APPROVAL|BRANCH|STATUS_CHANGE|CLOSE,
        config: {...} }
  closing_condition:
    - case.status in [RESOLVED, CLOSED]
  exception_handling:
    - on send_failure: retry x2, then escalate
```

### 5.2 7 Step Types

| Type | 동작 | 사람 개입 |
|---|---|---|
| AI_ACTION | LLM 호출 | 무 |
| AUTO_ACTION | 시스템 액션 | 무 |
| NOTIFY | Slack/Email/SMS | 무 |
| WAIT | 시간 대기 | 무 |
| APPROVAL | 사람 승인 | **필수** |
| BRANCH | 조건 분기 | 무 |
| STATUS_CHANGE / CLOSE | 상태 전이 | 무 |

### 5.3 16 Templates 카탈로그

상세 SOP YAML 은 `src/sops/*.yaml` 에 코드로 생성 (Phase 1 W10).

| SOP | 트리거 | Owner |
|---|---|---|
| SOP_HOTEL_NO_RESPONSE | WAITING_FOR_HOTEL + SLA 초과 | OPS |
| SOP_SUPPLIER_NO_RESPONSE | WAITING_FOR_SUPPLIER + SLA | OPS |
| SOP_URGENT_CHECKIN | P0 분류 | OPS Lead |
| SOP_HOTEL_NO_RECORD | "no record" 분류 | OPS |
| SOP_OVERBOOKING | "overbooked" 분류 | OPS Lead + Sourcing |
| SOP_REFUND_REQUEST | type=REFUND | Finance + Owner |
| SOP_NO_SHOW_DISPUTE | type=NO_SHOW_DISPUTE | OPS + Finance |
| SOP_CANCELLATION_FEE_DISPUTE | 분쟁 | Owner |
| SOP_CLIENT_PAYMENT_OVERDUE | 만기 D+1 | Finance + AM |
| SOP_INVOICE_DUE_SOON | 만기 D-7 | Finance |
| SOP_CREDIT_LIMIT_EXCEEDED | utilization ≥1.0 | Sales + Finance |
| SOP_NEW_BOOKING_WITH_OUTSTANDING | 신규+60+ 미수 | AM |
| SOP_PARTIAL_PAYMENT | 입금 < Invoice | Finance |
| SOP_PAYMENT_PROOF_MISMATCH | 증빙 ≠ Invoice | Finance |
| SOP_SALES_OVERRIDE_REQUEST | 신용 hold 우회 | Sales (결재 룰) |
| SOP_VIP_COMPLAINT | VIP + 분노 | AM + TL |

---

## 6. AI Agent Specification (21 Agents)

### 6.1 21 에이전트 명세

| Layer | Agent | Purpose | Output Confidence | Escalation |
|---|---|---|---|---|
| **INTAKE** | Email Intake | 인입 메일 트리아지 | 자기 + heuristic | P0/legal/unknown |
| | Language Detection | 언어 식별 (혼합 처리) | 모델 확률 | 50/50 mix |
| | Translation | 작업 언어로 번역 | back-translation | <0.8 |
| | Sender Identification | 발신자 식별 | 도메인>시그니처>본문 | UNKNOWN/다중 |
| | Reservation Matching | 부킹 매칭 | 정합 항목 + 호텔 패턴 | <0.7 또는 동률 |
| | Issue Classification | Case Type 분류 (18) | softmax entropy | <0.8 또는 P0/P1 |
| | Hotel Policy | 정책 인용 | 컨트랙트 매칭 | 미존재/모순 |
| **EXECUTION** | Hotel Inquiry Drafting | 호텔용 메일 (다국어) | 정합성+톤 일관 | 컨트랙트 인용 필요 |
| | Supplier Inquiry Drafting | 공급선용 (컨트랙트 인용) | 동일 | SLA 분쟁 |
| | Client Reply Drafting | 클라이언트 회신 (톤 매칭) | 톤+사실 정합성 | VIP/분노/분쟁 |
| | Collection Reminder Drafting | dunning 5단계 | 톤+법적 안전성 | D+30+ 의무 사람 |
| | Billing Status | Invoice 라이프사이클 | 룰 기반 | 매칭 모호 |
| | Payment Matching | 입금 ↔ 인보이스 | 매칭 격차 | AMBIGUOUS |
| | Outstanding Detection | 일배치 트리거 | 룰 기반 | 신규 90+ 진입 |
| | Credit Risk | 신용 결정 권고 | 룰+ML | HIGH/CRITICAL |
| | Follow-up·Chase | Chase 시퀀스 | 룰+학습 | max chases |
| | SOP Execution | BRANCH 노드 판단 | self-eval+학습 | <0.85 |
| **DECISION** | Risk Detection | 통합 risk score | 룰 우선 | CRITICAL |
| | Escalation | 수신자/채널/SLA 결정 | 룰 | (자체) |
| **QUALITY** | QA | 다른 에이전트 출력 검증 | 룰+LLM | HIGH severity |
| | Analytics | 인사이트/이상 탐지 | 통계 유의성 | anomaly |

### 6.2 10 Hard Safety Rules (절대 금지)

| # | AI MUST NEVER... |
|---|---|
| R1 | 환불을 승인하거나 환불액 약속 |
| R2 | 보상금/굿윌/credit/할인 약속 |
| R3 | 법적 책임 인정 ("저희 잘못") |
| R4 | 신용 hold 우회·해제 |
| R5 | 결제를 증빙 없이 "받았음" 표시 |
| R6 | 데이터 없이 부킹 상태 변경 |
| R7 | 게스트 PII 불필요 인용 |
| R8 | 미해결 케이스 임의 close |
| R9 | SLA 무시/timer 임의 정지 |
| R10 | 클라이언트/호텔에 공격·위협 언어 |

### 6.3 결정적 가드 (코드 레벨)

```python
FORBIDDEN_PHRASES = {
    "refund_promise":   ["환불 처리해 드리겠습니다", "we will refund", "환불 확정"],
    "comp_promise":     ["보상해 드리겠습니다", "we will compensate", "credit 발행"],
    "legal_admission":  ["저희 책임입니다", "we accept liability", "our fault"],
    "legal_threat":     ["법적 조치", "legal action", "sue", "소송"],
    "credit_override":  ["hold 해제", "한도 우회"],
}

def safety_gate(draft_text: str, context: Context) -> SafetyResult:
    issues = []
    for category, phrases in FORBIDDEN_PHRASES.items():
        for p in phrases:
            if p.lower() in draft_text.lower():
                issues.append({"category": category, "phrase": p, "severity": "HIGH"})
    if pii_detector.has_passport(draft_text) and not context.requires_passport:
        issues.append({"category": "PII", "severity": "HIGH"})
    if any(i["severity"] == "HIGH" for i in issues):
        return SafetyResult(verdict="BLOCK", issues=issues)
    return SafetyResult(verdict="PASS", issues=issues)
```

### 6.4 12 Production Prompt Templates

전체 프롬프트는 `prompts/*.md` 에 별도 관리. 각 프롬프트는:

- **Role / Goal / Input format / Output JSON schema / Rules / Forbidden actions / Escalation conditions / Example I/O**

12개: Email Intake / Reservation Matching / Issue Classification / Hotel Inquiry Drafting / Client Reply Drafting / Collection Reminder Drafting / Payment Matching / Credit Risk / SOP Execution / Risk Detection / Escalation / QA.

---

## 7. Risk Scoring Model (0-100)

### 7.1 Hard Triggers (1개 매치 → CRITICAL)

| Trigger | 검사 |
|---|---|
| LEGAL_KEYWORD | "lawyer", "lawsuit", "regulation", "사법", "고발", "공정위" |
| URGENT_CHECKIN | 게스트 로비/체크인 실패 + D-당일 |
| VIP_COMPLAINT | client.tier=VIP AND sentiment ≤ -0.3 |
| OVERBOOKING_DAY_OF | overbooked + D-당일/D-1 |
| CRITICAL_AGING | 미수 D+90+ |
| MEDIA_RISK | "press", "언론", "기자" |
| EXEC_REQUEST | C-level 직접 메일 |

### 7.2 Soft Factors (총합 0~100)

| Factor | 최대 | 산출 |
|---|---|---|
| F1. Urgency | 15 | P0=15, P1=10, P2=5, P3=0 |
| F2. Client Tier | 10 | VIP=10, Premium=7, Standard=4, Trial=2 |
| F3. Booking Value | 10 | ≥10K=10, 5-10K=7, 1-5K=4, <1K=0 |
| F4. Payment Status | 10 | Disputed=10, Overdue=7, Pending=3, Paid=0 |
| F5. Outstanding Amount | 10 | ratio*10 cap 10 |
| F6. Credit Limit Usage | 10 | utilization*10 cap 10 |
| F7. Sentiment | 10 | <-0.5=10, -0.5..-0.2=7, -0.2..0.2=2, else 0 |
| F8. Refund/Comp Request | 10 | refund=8, comp=10 |
| F9. Check-in Proximity | 15 | D-0=15, D-1=12, D-2..3=8, D-4..7=4 |
| F10. Hotel Response Delay | 5 | clamp(elapsed/sla*5, 0, 5) |
| F11. AI Confidence (inverse) | 5 | (1 - min_conf)*5 |
| F12. Historical Issue Count | 5 | clamp(disputes_30d, 0, 5) |

### 7.3 Bands

| Band | 범위 | UI 색 | 자동화 | 액션 |
|---|---|---|---|---|
| LOW | 0-24 | Green | 자동 발송 가능 | AI 진행 |
| MEDIUM | 25-49 | Yellow | 드래프트 자동, 발송 사람 | 4h 사람 검토 |
| HIGH | 50-74 | Orange | 사람 발송 강제 | 1h 사람 큐 |
| CRITICAL | 75+ | Red | 자동화 차단 | 즉시 에스컬레이션 |

---

## 8. Auto-Send Eligibility (12 Hard Gates)

```
1. risk_band ∈ {LOW} (또는 옵트인 시 MEDIUM)
2. AI confidence ≥ 0.90 (drafting), ≥ 0.92 (matching)
3. Approved template
4. No refund/compensation phrase
5. No legal keyword
6. No credit hold status
7. Not VIP client
8. No payment dispute
9. No PII over-share
10. Send window (평일 09~18 또는 야간 옵트인)
11. No same recipient auto-send within 1h
12. Per-case auto-send ≤2회
```

→ 1개라도 실패 시 Human Approval 큐로 라우팅.

### 8.1 사람 승인 의무 15가지

환불 / 보상 / 법적 위협 / VIP / 분노 톤 / 긴급 체크인 / 오버부킹 / 결제 분쟁 / 한도 초과 / Booking hold / Sales 우회 / Finance 결재 / Write-off / 낮은 AI 신뢰도 / 매칭 실패

---

## 9. SLA Rules (9개)

| 룰 | 시작 | 목표 | Pause | 위반 액션 |
|---|---|---|---|---|
| Client First Response | 클라이언트 메일 수신 | Standard 4h / VIP 1h | WAITING_FOR_CLIENT | CS Lead → TL |
| Hotel Response | 호텔 메일 발송 | 호텔별 (HB 4h, 직거래 12h, VN 6h) | 호텔 영업시간 외 | 1차 chase / TL |
| Supplier Response | 동일 | 공급선 컨트랙트 우선, 폴백 24h | 동일 | 동일 |
| Urgent Check-in | P0 분류 | **5분 / 30분** | 없음 (24/7) | TL+AM SMS / COO SMS |
| Payment Collection | 만기일 | D+0 | 분쟁 시 | 단계별 dunning |
| Outstanding | Aging Bucket 진입 | 30/60/90/120 | 분쟁/PtP | AM/Finance Mgr/COO |
| Finance Review | FINANCE_REVIEWING 진입 | 일반 48h, 분쟁 7d | 외부 정보 대기 | Finance Manager |
| Manager Approval | MANAGER_APPROVAL_REQUIRED | 24h (긴급 4h) | 추가 정보 요청 | 백업 자동 라우팅 |
| Credit Hold Decision | BOOKING_HOLD_RECOMMENDED | 24h | 결제 정보 대기 | Sales+Finance Mgr |

---

## 10. Security Spec

### 10.1 Multi-Tenant Isolation (3중)

```sql
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON cases USING
  (workspace_id::text = current_setting('app.current_workspace_id', true));
```

3중 방어: 앱 검증 + RLS + Connection 풀 격리.

### 10.2 RBAC

5 시스템 역할 (OPS/CS/FINANCE/LEADER/ADMIN) + 권한 코드:
`case.read / case.create / case.transition / case.approve_send / invoice.create / invoice.write_off / credit.read / credit.set_limit / credit.override / admin.users / admin.integrations / audit.read`

### 10.3 Data Encryption

| 위치 | 정책 |
|---|---|
| Transit | TLS 1.3 only, HSTS preload |
| At-rest (DB) | AES-256 + KMS column encryption (PII) |
| Secrets | AWS Secrets Manager / Doppler |
| OAuth tokens | KMS 암호화 후 DB 저장 |
| 첨부 (S3) | SSE-KMS, presigned URL 만 (만료 15분) |
| 백업 | 동일 KMS 키, cross-region |

### 10.4 PII Masking

- 여권번호 원문 저장 X (`document_hash` SHA-256+salt)
- LLM 호출 시 redact (`{guest_name}`, `{document_id}` 토큰화)
- UI 마스킹 (`****1234`), 권한자만 unmask
- 로그에 PII 절대 X

### 10.5 Data Retention

| 데이터 | 보유 |
|---|---|
| Case content | 7년 |
| Email raw | 7년 (S3 cold) |
| Audit log | 7년 (immutable) |
| AI decisions | 2년 |
| Guest PII | 5년 후 자동 익명화 |
| Logs | 30d hot / 1y warm / 7y cold |

---

## 11. Pseudocode (8 Core Algorithms)

전체 production-ready pseudocode 는 Page 4 §7 참조. 핵심 8개:

1. `create_case(source, payload, actor)` — Idempotency, classify, match client/booking, derive priority/SLA, persist, emit, trigger SOP
2. `transition_status(case_id, target, actor, reason)` — Validate ALLOWED_TRANSITIONS, run guards, pause/resume SLA, audit
3. `evaluate_sla_timers()` — cron 매분, threshold notifications, auto escalation
4. `schedule_next_chase(case)` — chase intervals, tone ladder, time window guard, generate draft, approval routing
5. `detect_payment_overdue()` — 일배치 06:00, milestone 검사, dunning trigger
6. `check_credit_on_new_booking(booking)` — utilization 계산, decision tree, approval chain
7. `SOPEngine.run(execution_id)` — Step 실행 + WAIT/APPROVAL suspend + exception handling
8. `trigger_escalation(case, reason)` — Rule 매치, recipient 결정, idempotency, 다단계 자동 승급

---

## 12. Frontend UI Spec

### 12.1 30 화면 카탈로그

상세는 Page 7 §2 참조. 16개는 프로토타입 구현됨 ([저장소](https://github.com/bstars00-rgb/ops-cs)).

### 12.2 Case Detail 4-Region 레이아웃

```
┌─ 헤더 (sticky) ──────────────────────────────────────────────────┐
│ ◀ Cases   CASE-2026-05-3987   [TYPE]   [RISK 95]   Owner / Priority / Status │
│ SLA bar  │  [Take Over] [Hotel Direct] [Re-assign] [⋯]                       │
├──────────────────────────────────────────────────────────────────┤
│ 좌측 (300)    │ 중앙 (flex)                          │ 우측 (340)        │
│ Client        │ AI Suggested Next Action (sticky)     │ SOP Progress     │
│ Reservation   │ Tabs: Timeline / Drafts / Tasks / Files│ Related          │
│ Hotel         │ Timeline (시간순 카드)                  │ AI Decisions     │
│ Quick Actions │                                        │ Audit (last 5)   │
│               │ [bottom action bar sticky]             │                  │
└──────────────────────────────────────────────────────────────────┘
```

### 12.3 8 UX Principles

OPS Speed First / Clear Next Action / One Case One Truth / Human Approval Visibility / Risk-First Prioritization / No Hidden AI Action / Timeline-Based Accountability / Finance/OPS/Sales Collaboration.

---

## 13. Tech Stack 결정 (확정)

| 컴포넌트 | 선택 |
|---|---|
| Frontend | Next.js 14 + TypeScript + TailwindCSS + shadcn/ui + TanStack Query + React Hook Form + Zod |
| Backend | Python 3.12 + FastAPI + Pydantic v2 + SQLAlchemy 2.0 + Alembic |
| Database | PostgreSQL 16 + pgvector + RLS |
| Vector DB | pgvector (단일 DB) |
| Queue | Celery + Redis broker + flower |
| Scheduler | Celery Beat + APScheduler (MVP) → Temporal (Phase 2 SOP) |
| Email | Gmail API + Microsoft Graph + IMAP/SMTP fallback + AWS SES |
| AI | Anthropic Claude SDK (primary) + OpenAI SDK (fallback) |
| Translation | LLM 우선 + Google Translate v3 fallback |
| Auth | NextAuth.js + FastAPI JWT + Google/MS OAuth + MFA TOTP |
| Hosting | (MVP) Vercel + Render/Fly + Supabase → (Year 1+) AWS ECS Fargate + RDS + ElastiCache + S3 |
| File Storage | S3 (또는 R2) + SSE-KMS |
| Notification | Slack webhook + AWS SES + Twilio + WebSocket (Pusher/Soketi) |
| Audit | Postgres append-only + 월별 partition + S3 cold |
| Multi-tenant | Single DB + workspace_id + Postgres RLS |
| Observability | OpenTelemetry → Datadog/Grafana + Sentry + Better Stack |
| CI/CD | GitHub Actions + Docker |
