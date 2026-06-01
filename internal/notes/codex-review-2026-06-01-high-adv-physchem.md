# Codex 교차검수 반영 — Claude 고등 진로선택 물리·화학 (KA-HIGH-ADV-PHYSCHEM-REVIEW-1)

Date: 2026-06-01
Reviewer: Codex / Author: Claude
대상: `high-adv-mechanics.ts`, `high-adv-matter-energy.ts`
작업 브랜치: `newton` (격리 워크트리 `semiconductor-universe-newton`)

## 판정: Codex 3건 전부 타당 — 수정 완료(4곳)

Codex가 `origin/main`(fe3aed7) Claude 진로선택 콘텐츠를 검수, 과학적 정밀성 3건 지적. 모두 정당하여 반영.

### 1. 총 반동 — 추진체 가스 누락 (high-adv-mechanics.ts, am-momentum-2 funFact)
- 원문: "총이 뒤로 밀리는 반동은 총알이 앞으로 얻은 운동량과 **정확히** 크기가 같다."
- 문제: 총-총알-가스 계에서 총의 반동 운동량 = 총알 운동량 + **분출 화약 가스 운동량**. 가스를 빼면 "정확히 같다"가 성립 안 함.
- 수정: "총알과 분출되는 화약 가스가 앞으로 가져간 운동량을 **합한 만큼**을 총이 반대로 받는다 — 총·총알·가스를 한 계로 보면 전체 운동량은 0으로 보존(가스를 무시하면 총 반동을 총알 운동량과 같다고 **단순화**)."

### 2. 충돌 운동량 보존 — 닫힌 계 조건 누락 (high-adv-mechanics.ts, am-momentum-3 body)
- 원문: "**모든 충돌에서** 운동량은 **항상** 보존되지만…"
- 문제: 외부 알짜 충격량이 있으면 운동량 보존 안 됨. "닫힌 계 / 외부 충격량 무시" 전제 필요.
- 수정: "외부에서 작용하는 알짜 충격량이 무시될 만큼 작은 충돌, 즉 두 물체를 **하나의 닫힌 계로 볼 수 있는 충돌에서는** 충돌의 종류와 상관없이 운동량이 보존되지만…"

### 3. 절대 온도 — 0 K에서 운동 정지 단정 (high-adv-matter-energy.ts, me-states-1 body + keyTerm)
- 원문(body): "절대 온도는 입자의 **운동이 멈추는** 가장 낮은 온도를 0으로 삼은…" / (keyTerm): "입자 운동이 멈추는 점을…"
- 문제: 0 K에서도 양자역학적 영점 운동(zero-point motion)이 남음. "운동이 완전히 멈춘다"는 부정확.
- 수정(body): "입자의 **열운동 에너지가 더 낮아질 수 없는** 가장 낮은 온도(0 K)를 0으로 삼은… 0 K는 흔히 운동이 멈춘 상태로 단순화해 그리지만, 실제로는 열운동 에너지가 최소가 되는 극한이며 **양자역학적으로는 미세한 잔여 운동이 남는다.**" / (keyTerm): "입자의 열운동 에너지가 최소가 되는 가장 낮은 온도(0 K)를…"

## 게이트
- `npm run build`: ✅ PASS (built 1.37s)
- `npm run lint`: ✅ PASS (eslint 0)
- 잔존 부정확 표현 grep: 0건

## Codex 커밋 `7b7584c` 검토 (심화파트 네비게이션) — 통합 판단
- 내용: `types.ts`에 옵셔널 필드 `track?: "공통"|"일반 선택"|"진로 선택"|"융합 선택"` 추가 + 16개 Grade 파일에 `"track": …` 1줄 + `TheoryView.tsx`(97줄, 선택군별 네비게이션 UI). 내 high-adv-* 4개에도 `"track":"진로 선택"` 추가됨(codex 브랜치).
- 성격: **types.ts + TheoryView.tsx를 포함한 atomic 공유 인프라 변경.** 사용자에게 고등 과목군(공통/일반선택/진로선택/융합선택) 네비게이션을 보여주는 UX 개선이라 **main 통합 가치 있음.**
- 격리 원칙 처리: 공유 파일(types/TheoryView)은 각자 브랜치서 안 건드리고 **main 통합에서 해결**이 원칙. `track`은 옵셔널이라 내 콘텐츠와 독립. 내 이번 수정(body 텍스트)은 codex의 `track` 1줄과 라인이 달라 **머지 충돌 거의 없음**.
- **권장(박사 디렉팅 영역):** Codex `7b7584c`(codex 브랜치)와 newton(이 수정)을 **박사가 main으로 통합** — high-adv-mechanics/matter-energy 두 파일은 라인 단위 자동 머지 예상, 충돌 시 trivial. Claude는 공유 파일에 손대지 않음.
