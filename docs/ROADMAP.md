# OpsCS — Roadmap

> **0~24개월 실행 계획** — 검증 / 빌드 / 출시 / 확장 전 단계.

---

## Phase 0: Validation (Day 0~30)

**목표**: 디자인 파트너 1~2곳 확보 + 페인 검증.

| Week | 활동 | 산출물 |
|---|---|---|
| W1 | 인터뷰 10건 (한국 도매 4 + DMC 2 + 베트남 2 + 일본 1 + 액센트 1) | 페인 톱5 + ICP 시그널 |
| W2 | 클릭 가능 Figma + 5분 데모 영상 | 7개 핵심 화면 walkthrough |
| W3 | 디자인 파트너 후보 3곳 제안서 + LOI | 1~2장 |
| W4 | 디자인 파트너 계약 + paid pilot 후보 5곳 디스커버리 | 계약서 + Q2 파이프 |

### Decision Gate (Day 30)

| 지표 | 합격선 |
|---|---|
| 인터뷰 완료 | ≥10건 |
| 페인 일치 ("OPS 시간 회수 우려") | ≥7명 |
| WTP $2K+ 90일 paid pilot | ≥4명 긍정 |
| 디자인 파트너 LOI | 1~2장 |
| 다음 단계 미팅 예약 | ≥5건 |
| Critical NO ("관심 없음") | ≤30% |

→ 미달 시 wedge 재정의 / ICP 재선정.

---

## Phase 1: MVP Build (Week 1~12)

**팀**: PM 1 / 풀스택 2~3 / AI 엔지니어 1 / QA 1 (총 5~6명)

### 주차별 계획

| 주차 | 주제 | 핵심 산출물 |
|---|---|---|
| **W1~2** | Foundation | DB ERD v1, 와이어프레임 30~40장, Tech architecture, CI/CD |
| **W3~4** | Auth · Workspace · Users · Roles · Case CRUD | 로그인 / RBAC v1 / Case 수기 생성 / 상태 전이 / Internal Notes |
| **W5~6** | Email Integration · Email-to-Case · Timeline | Gmail OAuth + IMAP fallback / parser / Email→Case / 타임라인 |
| **W7** | Reservation Import + Match Agent v1 | CSV import / LLM 매칭 ≥85% / 사람 큐 |
| **W8** | Hotel Directory · Client Profile · Payment Terms | 마스터 데이터 + 도메인 매칭 + 결제조건 |
| **W9** | AI Classification · Hotel Inquiry · Client Reply Drafting | 4 언어 / 톤 단계화 / 100% 사람 승인 |
| **W10** | SLA Timer · Chase Scheduler · Escalation Queue | timezone 인식 / 5~10 룰 / Slack+Email |
| **W11** | Billing · Outstanding · Collection Reminder · Audit | Invoice / Aging / Dunning + Audit append-only |
| **W12** | Dashboard · QA · Pilot 시작 | 4 역할 뷰 / 디자인 파트너 첫 운영일 |

### 출시 Hard Gates (W12 종료)

| Gate | 합격선 |
|---|---|
| **G1. 가치** | OPS 1인 시간 회수 ≥주 5h + 컨펌 평균 −20% |
| **G2. 안전** | Critical 발송 사고 0건 + Audit 완전성 100% |
| **G3. 신뢰** | Pilot 1곳 자발 갱신 의사 |

3개 모두 통과 시 출시. 1개라도 실패 시 quality 추가 (기능 추가 X).

---

## Phase 2: Expand (Month 4~6)

**목표**: 자동 발송 비율 30~50%, 다채널, AR 자동 매칭. 디자인 파트너 → 유료 전환, 신규 ICP 3~5곳 land.

### M4: Advanced SOP + Auto Credit Hold

| Sprint | 주제 |
|---|---|
| W13~14 | SOP DSL Visual Editor (사용자 편집/버전/A-B) |
| W15 | SOP A/B + 실행 로그 분석 |
| W16 | Auto Credit Hold + 우회 워크플로우 |

### M5: Multichannel + Payment Matching

| Sprint | 주제 |
|---|---|
| W17~18 | KakaoTalk Biz Channel |
| W19 | WhatsApp Business |
| W20 | Auto Payment Matching (룰+LLM, Bank Feed CSV) |

### M6: Advanced Analytics + Team Collab + Client Portal

| Sprint | 주제 |
|---|---|
| W21 | Advanced Analytics (Cohort/Trend, Scorecard, 자동 주간 리포트) |
| W22 | Team Collaboration (share/transfer, 팀 큐, 워크로드) |
| W23~24 | Client Portal v1 (read-only 부킹·인보이스·결제 링크) |

---

## Phase 3: Scale (Month 7~12)

| 시점 | 마일스톤 |
|---|---|
| M7~8 | ERP Integration (Xero / 더존) — 첫 enterprise lead |
| M9 | Bank Feed CSV → 자동 매칭 60%+ |
| M10 | Mobile-responsive Web (네이티브 앱은 미구축) |
| M11 | SOC 2 Type I 감사 시작 |
| M12 | Predictive Credit Score (룰 기반 → ML) — 데이터 6개월 누적 후 |

---

## Phase 4: Geo + Vertical Expansion (Month 13~24)

| 시점 | 마일스톤 |
|---|---|
| M13~15 | 베트남 진출 (현지 영업 + Zalo 통합) |
| M16~18 | 일본 첫 deal + LINE 통합 |
| M19~21 | Voice Agent (전화 follow-up, 일부 호텔만 옵트인) |
| M22~24 | 항공/렌터카/투어 vertical 확장 검토 (Series A 후) |

---

## 24-Month 마일스톤 요약

| 시점 | 누적 paid + design partner | MRR |
|---|---|---|
| M3 | 1~2 | $0 (lighthouse 무상) |
| M6 | 3~4 | $7K~10K |
| M9 | 5~6 | $25K~50K |
| M12 | 7~8 | $80K~120K |
| M18 | 12~15 | $200K |
| M24 | 20~25 | $400K~600K, **Series A** 가능 |

---

## 절대 하지 말아야 할 것 (24개월)

> 6개를 어기면 24개월 안에 실패한다.

1. MVP 12주에 카톡/WhatsApp 추가 X (이메일 집중)
2. 호텔 자체(sell-side) 영업 X (다른 ICP)
3. Enterprise 18개월 영업 시작 X (미드마켓 land 먼저)
4. 자체 결제 처리 만들지 X (Stripe/포트원 통합)
5. AI 자동 발송 비율 50% 넘기지 X (12개월 내, 신뢰 모트)
6. 창업자가 Customer Success 안 하지 X (첫 6개월 직접 운영)
