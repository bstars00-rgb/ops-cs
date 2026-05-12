# SOP Library — VNOP Operations

> **Standard Operating Procedures** for VNOP (Vietnam Operations) Booking Management Team.
> 누구든지 확인하고, 이해하고, 진행할 수 있도록 설계된 표준 운영 절차 모음.

---

## 📁 현재 등록된 SOP (9개)

| ID | 제목 | 카테고리 | 버전 | 발효일 |
|---|---|---|---|---|
| [SOP-001](./SOP-001.md) | NOT FOUND Booking 처리 | Booking Management | 1.0 | 2025-12-16 |
| [SOP-002](./SOP-002.md) | Name Change Request 처리 | Booking Amendment | 1.1 | 2025-12-16 |
| [SOP-003](./SOP-003.md) | Booking Reconfirm | Booking Reconfirmation | 1.2 | 2026-05-05 |
| [SOP-004](./SOP-004.md) | Free Cancellation Request (AGT) | Cancellation | 1.0 | 2026-05-05 |
| [SOP-005](./SOP-005.md) | Date Amendment Request (AGT) | Booking Amendment | 1.0 | 2026-05-05 |
| [SOP-006](./SOP-006.md) | Special Request (AGT) | Special Request | 1.0 | 2026-05-05 |
| [SOP-007](./SOP-007.md) | Phone Call from AGT / Hotel | Communication | 1.0 | 2026-05-05 |
| [SOP-008](./SOP-008.md) | Rejection Bookings | Rejection & Compensation | 1.0 | 2026-05-05 |
| [SOP-009](./SOP-009.md) | Pending / Failed Bookings Check | Daily Operations | 1.0 | 2026-05-05 |

**원본 문서**: `../SOP/VNOP_SOP_All_v1.0.docx` (Word, 2026-05-12)

---

## 🎯 SOP 시스템의 목표

1. **누구든지 보고 이해할 수 있게** — OPS 신입도 5분 안에 따라할 수 있게
2. **누구든지 편집할 수 있게** — 개발자 아니어도 `.md` 파일 직접 수정 가능
3. **변경 이력이 남게** — Git 으로 누가 언제 무엇을 바꿨는지 추적
4. **시스템이 이걸 읽을 수 있게** — 미래에 AI 에이전트가 SOP를 자동 실행할 수 있도록 구조화

---

## 📋 SOP 표준 구조 (모든 SOP가 동일 형식)

```markdown
---
id: SOP-XXX              # 고유 식별자
title: 한 줄 제목
version: "1.0"           # 버전 (의미적 버전 — major.minor)
effective_date: YYYY-MM-DD
prepared_by: 이름 / 부서
team: VNOP
category: 카테고리 (목록 아래 참조)
summary: 1~2 문장 요약 — 리스트 뷰에서 보임
keywords: [tag1, tag2, ...]   # 검색용
related: [SOP-XXX, ...]       # 연관 SOP
escalation_to: 에스컬레이션 대상
estimated_time_minutes: N     # 평균 처리 시간
---

## 1. Purpose       (목적)
## 2. Scope         (범위)
## 3. Responsibilities (책임)
## 4. Procedure     (절차)
    ### Step 1 — ...
    ### Step 2 — ...
## 5. Notes         (주의사항)
## Reference Table  (선택 — 참조 표)
## Quick Reference  (필수 — 한 화면 요약)
```

### 카테고리 (현재 사용 중)

- `Booking Management` — 부킹 일반 처리
- `Booking Amendment` — 부킹 수정 (이름/날짜)
- `Booking Reconfirmation` — 재확인
- `Cancellation` — 취소 처리
- `Special Request` — 특별 요청
- `Communication` — 전화/메일 응대
- `Rejection & Compensation` — 거절·보상
- `Daily Operations` — 일일 운영 작업

---

## ✏️ 새 SOP 추가하는 법 (5단계)

### 1단계: 파일 생성

```bash
# 다음 사용 가능한 번호로 파일 생성
touch sops/SOP-010.md
```

### 2단계: Template 복사

위 "SOP 표준 구조" 그대로 복사 → 새 파일에 붙여넣기.

### 3단계: Frontmatter 작성

```yaml
---
id: SOP-010
title: How to Handle Group Booking Inquiry
version: "1.0"
effective_date: 2026-06-01
prepared_by: 본인 이름 / 부서
team: VNOP
category: Booking Management
summary: 그룹 예약 (10명+) 문의 받았을 때 — 호텔에 단체 견적 요청 → 24h 내 회신
keywords: [group-booking, inquiry, quote]
related: [SOP-001]
escalation_to: Supervisor
estimated_time_minutes: 20
---
```

### 4단계: 본문 작성

- Step 별로 명확하게 (Step 1, Step 2, ...)
- 분기점은 **Case A / Case B** 또는 **YES / NO**
- 표 적극 활용 (참조 표)
- **Quick Reference** 표는 필수 — 1줄 액션 매핑

### 5단계: README 업데이트 + Git 커밋

```bash
# sops/README.md 상단의 목록 표에 새 SOP 한 줄 추가
git add sops/SOP-010.md sops/README.md
git commit -m "feat(sop): add SOP-010 group booking inquiry"
git push
```

GitHub Actions 가 자동으로 사이트를 재배포합니다 (약 1~2분).

---

## 🔧 기존 SOP 수정하는 법

### 작은 변경 (오타, 표현)

```bash
# 1. .md 파일 직접 편집
# 2. version은 그대로 유지 (예: 1.0)
# 3. 커밋
git commit -m "fix(sop): typo in SOP-004 reason table"
```

### 큰 변경 (절차 변경, 단계 추가)

```bash
# 1. .md 파일 편집
# 2. frontmatter 의 version 올림 (1.0 → 1.1 또는 2.0)
# 3. effective_date 갱신
# 4. 커밋 메시지에 변경 요약
git commit -m "feat(sop): SOP-008 add Step 6 for Booking.com special case (v1.0 → 1.1)"
```

---

## 🔍 검색 & 사용

- **온라인**: https://bstars00-rgb.github.io/ops-cs/sop — 검색·필터·체크리스트 가능
- **로컬**: VS Code / 메모장으로 `.md` 파일 직접 열기
- **Word**: 원본 `../SOP/VNOP_SOP_All_v1.0.docx`

### Git 변경 이력 보기

```bash
# 특정 SOP의 변경 이력
git log --follow -p sops/SOP-004.md

# 누가 마지막으로 수정했나
git blame sops/SOP-004.md
```

---

## 🎓 SOP 작성 베스트 프랙티스 (OPS 팀 가이드)

### DO ✅

- **현재형 동사로 시작**: "Receive the request" / "Check the booking" (X "We should receive...")
- **분기점은 Case A/B 또는 YES/NO** 로 명확히
- **숫자/시간/금액은 본문에 명시**: "100 USD per room per night", "twice daily", "09:00 AM"
- **표 사용**: 분기 룰이 3개 이상이면 표로 (예: SOP-004 Reasonable vs Unreasonable)
- **Quick Reference 추가**: 매 SOP 끝에 1줄 액션 매핑 표
- **에스컬레이션 명시**: "If hotel does not respond, escalate to supervisor immediately"

### DON'T ❌

- ~~"Please verify carefully and try your best to..."~~ → "Verify the 5 fields"
- ~~3페이지 분량 한 Step~~ → Step 을 더 나누거나, sub-step 또는 표로
- ~~"Sometimes / usually / often"~~ → 구체 조건 명시
- ~~Word 형식의 컬러/굵기 의존~~ → Markdown 의 `**bold**` 와 `>` blockquote 만 사용

---

## 🏗️ 기술 메모 (개발자용)

본 SOP 시스템은 **Markdown + Frontmatter** 기반. Next.js 가 빌드 시 모든 `.md` 파일을 읽어 정적 페이지로 렌더링.

- **파싱**: `gray-matter` (frontmatter) + `react-markdown` (본문, GFM 지원)
- **빌드**: `npm run build` 시 `sops/*.md` → static pages
- **검색**: 클라이언트 측 fuzzy search (frontmatter + 본문 keywords)
- **배포**: GitHub Pages 자동 (push 시 GitHub Actions 트리거)

향후 확장 (Phase 2):
- AI 에이전트가 SOP frontmatter 의 `id` + `procedure` 를 읽어서 자동 실행
- 케이스 type 별로 적절한 SOP 자동 추천
- SOP 실행 이력 추적 (어느 case에서 어느 SOP 따랐는지)

---

## 📞 문의

SOP 관련 변경 제안 / 오류 제보:
- Vicky / Operation (현재 maintainer)
- GitHub Issues: https://github.com/bstars00-rgb/ops-cs/issues
