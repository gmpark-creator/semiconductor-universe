# Codex 교차검수 — Claude 고2 물리학 (KA-HIGH-PHYS-REVIEW-1, #41)

Date: 2026-06-01
Reviewer: Codex / Author: Claude / 수정: Claude
대상: `src/data/theory/high-physics.ts` (10단원) + 물리 SVG 10종

## 판정: 구조·렌더링 PASS, 내용 4건 수정 권고 → **4건 전부 타당, 수정 완료**

## Findings & 조치

### 1. 속도-시간 그래프 넓이 = 변위 (이동거리 아님) ✅ 수정
- 부호 있는 v-t 넓이는 변위. 이동 거리는 |v| 면적/속력-시간 그래프.
- 조치: 본문 + keyTerm desc + funFact + 도해(phys-motion-graphs.svg "넓이=변위")까지 일괄 "변위"로 정정. "방향이 안 바뀌면 이동 거리와 같다" 보충.

### 2. 포물선 운동 수직 속도 "점점 빨라진다" ✅ 수정
- 비스듬히 위로 던지면 상승 구간에선 수직 속도가 줄어듦.
- 조치: "수직 속도는 중력으로 일정하게 변하며, 올라갈 때 줄어 꼭대기에서 0, 내려올 때 아래로 빨라진다"로 정정.

### 3. 운동량 보존 설명이 작용·반작용과 모순("힘이 상쇄") ✅ 수정
- p-newton-3에선 "다른 물체에 작용→상쇄 안 됨"으로 정확히 설명하는데 p-momentum-3에선 "힘이 상쇄"라 모순.
- 조치: "작용·반작용으로 한쪽 운동량 증가만큼 다른쪽 감소 → 계 전체 운동량 변화 0. 힘은 상쇄되는 게 아니라 운동량 변화가 상쇄"로 정정.

### 4. 전기·파동·양자가 전부 domain "운동과 에너지" 배지 ✅ 수정
- TheoryView가 domain을 배지·네비에 그대로 써서 전기장·회로·전자기유도·파동·반도체까지 "물리 · 운동과 에너지"로 표시됨.
- 조치: `Unit`에 `strand?` 추가 + `unitLabel()` 헬퍼. 10단원에 strand 부여(힘과 에너지5/전기와 자기3/빛과 물질2). 배지·좌측 네비·모바일 셀렉트 모두 "물리 · {strand}" 표시.

### 추가 권고 ✅ 수용
- highPhysics에 `id: "high2-physics"` 추가(완료). 
- 커밋 과목 단위 분리 — 이 수정은 물리학만 분리 커밋.

## 검증 (수정 후)
- typecheck / build / eslint(0) PASS, figureId 69/69, strand 10/10.
- Codex 원검증: build/lint/figureId/물리 SVG HTTP 200 — 구조·렌더링 PASS.
