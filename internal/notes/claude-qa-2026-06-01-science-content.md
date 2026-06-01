# Claude 과학 내용 최종 QA (KA-SCIENCE-CONTENT-QA-1)

Date: 2026-06-01
검수자: Claude (내용 검수 담당) / 구현 검수: Codex (별도 진행)
작업 브랜치: `newton` (worktree `semiconductor-universe-newton`, base `0830cf3`)
범위: 기초이론 과학 전체 23개 데이터 파일·129단원 (초/중/고1통합/고2일반선택4/진로4·심화/융합3)
방법: 학교급별 7개 병렬 검수 에이전트가 읽기 전용 분석 → Claude가 타당성 재판단 후 직접 수정.

## 판정: 데이터 수정 19건 + 도해 라벨 오타 1건 (총 20건). high 심각도 0건.
build ✅ / lint ✅. figureId 매핑·SVG 변동 없음(텍스트만).

## 수정 내역 (과목/단원/무엇을)

### 초등
1. `grade6.ts` g6-human-body-3 funFact — '척수에서 명령' → 초등 범위 밖 용어 제거 + 본문(자극→뇌→반응) 모델과 모순 해소("깊이 생각하기 전에 몸이 먼저 빠르게 반응").

### 중등
2. `middle1.ts` m1-gas-3 funFact(열기구) — "부피가 커지고 가벼워져"(인과 부정확) → "공기가 팽창해 밀도가 작아지고… 가벼워져"(밀도 개념).
3. `middle2.ts` m2-atom-1 — "더 이상 쪼갤 수 없는…원자"(다음 문단의 원자핵·전자 설명과 내부 모순) → "그 물질을 이루는 기본 알갱이".
4. `middle2.ts` m2-stars-universe-1 — "가장 밝은 별들은 1등급"(시리우스 등 1등급보다 밝은 별 존재) → "기준이 되는 밝은 별을 1등급…(실제로는 1등급보다 더 밝은 별도 있다)".

### 고2 일반 선택
5. `high-physics.ts` p-momentum-3 — "운동량의 합은 항상 일정"(과잉 단정) → "외부 알짜힘이 작용하지 않는 한(고립계)…일정"(조건 명확).
6. `high-physics.ts` p-waves-2(회절) — "틈이 좁고 파장이 길수록"(독립 단정) → "틈의 크기가 파장과 비슷하거나 작을수록(파장 대비 틈)".
7. `high-chemistry.ts` c-equilibrium-1 funFact — "이산화 탄소와 기체"(별개 물질로 오독) → "물에 녹아 있는 CO₂와 빠져나온 기체 상태의 CO₂".
8. `high2Biology.ts` b-life-systems-1 — 구성 단계에서 기관계 누락(기관→개체) → "기관→기관계→개체"(같은 단원 b-life-systems-3과 정합).
9. `high2Biology.ts` b-homeostasis-control-1 — 활동 전위 "이온 이동이 바뀌며"(모호) → 나트륨 유입(탈분극)·칼륨 유출(회복) 방향 명시.
10. `high2EarthScience.ts` 목성형 행성 keyTerm — "목성, 토성처럼"(천왕성·해왕성 누락, 지구형은 4개 나열돼 비대칭) → "목성, 토성, 천왕성, 해왕성".

### 고등 진로 선택 — 물리·화학(Claude)
11. `high-adv-em-quantum.ts` eq-induction-3 funFact — "1초에 60번 방향이 바뀌는 교류"(60 Hz=주기, 방향은 1초 120회) → "1초에 60번 진동(60 Hz, 방향은 1초 120번 바뀜)".
12. `high-adv-em-quantum.ts` eq-efield-1 — "중력보다 훨씬 강하다"(무조건) → "같은 두 입자 사이에서…훨씬 강하다(거시 천체에선 전하 중화로 중력 지배)".

### 고등 진로 선택 — 생물·지구·우주(Codex 작성, 박사 지시로 내용 검수)
13. `high-career-cell-metabolism.ts` 전자전달계 — 양성자 펌핑 방향 명시("기질→막 사이 공간으로 퍼내어").
14. `high-career-genetics.ts` 독립의 법칙 keyTerm — "서로 다른 형질"(연관 시 미성립 조건 누락, 본문은 연관 설명) → "서로 다른 염색체에 있는 유전자쌍…(연관은 예외)".
15. `high-career-planetary-space.ts` adv-planetary-systems-1 — "금속·암석이 주로 남아"(응결선 개념과 어긋남) → "휘발성 물질은 응결 못 하고 금속·암석만 응결".
16. `high-career-planetary-space.ts` adv-stars-observation-1 — 광도 본문 "에너지의 양"(keyTerm '단위 시간'과 불일치) → "단위 시간에 방출하는 전체 에너지".
17. `high-career-earth-systems.ts` adv-earth-origin-interior-2 — P/S파 본문이 keyTerm과 비대칭("P파 고체·액체"/"S파 액체 못 통과") → "P파 고체·액체·기체 모두, S파 고체만"(keyTerm과 정합).

### 고등 융합 선택(Codex 작성, 내용 검수)
18. `high-fusion-climate-ecology.ts` fusion-climate-system-2 본문 — 온실효과 "다시 방출"(하향 재복사 모호) → "사방으로 다시 방출하며 일부가 지표 쪽으로 되돌아와".
19. `high-fusion-climate-ecology.ts` fusion-climate-system-2 funFact — CO₂ "시간 지연을 가지고 나타납니다"(인과 부정확) → "이미 높아진 농도와 온난화 효과가 오랫동안 이어집니다".

### 도해 라벨
20. `public/figures/science/advphys-gravity-orbit.svg` — 원일점 라벨 "멈·느림"(오타) → "멀고·느림".

## 보류(수정 안 함) — 사유
- `grade5.ts` 용해도 "온도 높을수록 더 많이 녹는다": 초등 눈높이 단순화(설탕·소금 맥락)로 허용 범위.
- `high-physics.ts` 자유낙하 funFact "정확히 동시에": 진공을 명시했으므로 정당.
- `high-chemistry.ts` 용해도 예외/pH 7 상온 단서, 파장 정의 병기: 일반선택 수준의 표준 서술이라 과잉 정밀화 회피.

## ⚠️ Codex 구현 QA 시 봐야 할 위험 지점 (내용 검수 중 관찰, 구현 영역이라 미수정)
1. **figureId 네이밍 혼동**: `grade3.ts`의 동물 한살이 단원이 `figureId: "plant-lifecycle"`을 참조 — SVG 내용은 나비 한살이로 본문과 일치하나, 파일명이 plant라 매핑 점검 시 오해 소지. (구조 정리 여부 Codex 판단.)
2. **도해 in-SVG 제목 중복**: 일부 SVG(지구·생명 등)가 내부에 단원 제목을 포함 → 화면 h1과 중복 표시 가능. 이전부터 보류된 하모나이즈 항목(표시/레이아웃 영역).
3. **선택군(track) 매핑 검증**: 공통/일반선택/진로선택/융합선택 네비게이션 칩이 전 과목에 올바로 붙는지 — 특히 high1(통합과학)과 고2 일반선택 4과목의 track 값/표시 확인 권장(데이터엔 진로·융합만 track 명시, 나머지는 미지정→기본 흐름).

## 결론
과학 내용은 전반적으로 정확·양호. 명백한 사실 오류(high)는 없었고, 대부분 과잉 단정/조건 누락/본문-용어 정합성 개선이었다. 20건 수정 후 게이트 PASS. newton 브랜치 커밋·푸시.
