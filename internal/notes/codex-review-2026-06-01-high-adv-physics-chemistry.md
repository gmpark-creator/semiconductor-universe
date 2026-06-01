# Codex Review — Claude 고등 진로 선택 물리·화학 4과목

Date: 2026-06-01
Slice: KA-HIGH-ADV-PHYSCHEM-REVIEW-1
Target commit: `fe3aed7 feat(theory): 고등 진로 선택 물리·화학 4과목 신설 — 24단원 + 도해 24종`
Reviewer worktree: `semiconductor-universe-codex`
Branch: `codex`

## Result

PASS with non-blocking wording fixes.

구조, 스키마, 도해 연결, 빌드/린트는 통과했다. 과학 내용도 전반적으로 고등 진로 선택 수준에 맞다. 다만 과잉 일반화로 읽힐 수 있는 문장 3곳은 Claude가 자기 `newton` 브랜치에서 보정하는 것을 권장한다.

## Findings

1. `src/data/theory/high-adv-mechanics.ts:53`
   - Current: "모든 충돌에서 운동량은 항상 보존되지만..."
   - Issue: 운동량 보존은 외부 알짜힘이 없거나 충돌 시간이 짧아 외부 충격량을 무시할 수 있는 계에서 성립한다. 바로 앞 단원에서 조건을 설명했지만, 이 문장만 보면 모든 실제 충돌에서 무조건 보존되는 것처럼 읽힌다.
   - Suggested: "외부 충격량을 무시할 수 있는 충돌에서는 운동량이 보존되지만, 운동 에너지는 탄성 충돌에서만 보존된다."

2. `src/data/theory/high-adv-mechanics.ts:52`
   - Current: "총을 쏠 때 총이 뒤로 밀리는 반동은 총알이 앞으로 얻은 운동량과 정확히 크기가 같다."
   - Issue: 단순한 총-총알 2물체 모형에서는 맞지만, 실제 발사에서는 앞으로 나가는 화약 가스의 운동량도 포함된다. "정확히"가 과한 단정이다.
   - Suggested: "단순화한 총-총알 계에서는 총의 반동 운동량과 총알의 운동량 크기가 같고, 실제 발사에서는 분출 가스까지 포함해 계 전체 운동량을 따진다."

3. `src/data/theory/high-adv-matter-energy.ts:59`
   - Current: "절대 온도는 입자의 운동이 멈추는 가장 낮은 온도를 0으로 삼은 온도 척도이다."
   - Issue: 고등 기체론 수준에서는 흔한 설명이지만, 진로 선택 심화 자료에서는 양자적 영점 운동을 고려해 "입자 운동이 완전히 멈춘다"는 표현을 피하는 편이 더 정확하다.
   - Suggested: "절대 온도는 입자의 열운동 에너지가 이론적으로 최소가 되는 상태를 0 K로 삼은 온도 척도이다."

## Verified

- `npm ci`: PASS
- `npm run build`: PASS
- `npm run lint`: PASS
- registered `figureId` to SVG mapping: PASS
- advanced SVG XML parse: PASS
- dev server: `http://127.0.0.1:5187/` HTTP 200
- Claude adv phys/chem SVG 24종 HTTP 200

## Collision Audit

- Codex 전용 worktree `semiconductor-universe-codex` 생성 완료.
- 현재 브랜치 `codex`.
- Claude 전용 worktree `semiconductor-universe-newton`은 읽지 않고, 원격/공유 커밋 `fe3aed7`만 검수했다.
- Claude 파일을 직접 수정하지 않았다.
