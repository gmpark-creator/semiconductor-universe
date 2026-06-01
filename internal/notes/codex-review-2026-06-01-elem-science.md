# Codex 교차검수 — 기초이론 초등 과학 (KA-ELEM-REVIEW-1, #19)

Date: 2026-06-01
Reviewer: Codex / Implementer of fixes: Claude
기준: NCIC 2022 개정 교육과정 고시, 과학과 교육과정 자료

## 판정
기능 게이트(build/lint)는 통과하나, **모바일 화면 깨짐 + 과학 내용 오류 몇 건**은 수정 후 진행이 맞다는 검수. → **5건 전부 타당, 전량 수용·수정 완료.**

## Findings & 조치

### 1. BLOCK — 모바일에서 기초이론 화면 깨짐 ✅ 수정
- 원인: `TheoryView`가 고정 가로 flex + 좌측 286px 패널 → 390px 모바일에서 본문 폭 소멸, 제목 세로 쪼개짐, SectionNav 겹침.
- 조치: `src/hooks/useIsMobile.ts`(matchMedia ≤768px) 신설. `TheoryView`를 데스크탑/모바일 2-레이아웃으로 재작성 — 모바일은 상단 컴팩트 네비(학교급 탭 + 학년 가로스크롤 + **단원 `<select>`**) + 본문 100% 폭. `SectionNav`도 모바일 compact(브랜드·서브라벨 숨김, 패딩 축소). `AreaSelector`도 모바일 top 위치 하향(겹침 방지).

### 2. 과학 오류 — 볼록렌즈 근시 안경 ✅ 수정
- `grade6.ts` 빛과 렌즈: "멀리 보지 못하는 사람을 위한 안경"에 볼록 렌즈 → **근시 교정은 오목 렌즈**라 오류.
- 조치: "가까이 있는 것을 잘 보지 못하는 사람을 위한 돋보기 안경(볼록)"으로 정정 + "멀리 못 보는 사람은 오목 렌즈" 보충.

### 3. 과학 오류 — 화강암을 화산암 문맥에 ✅ 수정
- `grade4.ts` 화산: "용암이 식어 화산암 … 화강암" 흐름 → 화강암은 **심성암**(땅속 천천히 식음)이라 분리 필요.
- 조치: 화산암 예시는 현무암 중심, 화강암은 "마그마가 땅속에서 천천히 식은 암석"으로 별도 비교 문단.

### 4. 표현 보정 ✅ 수정
- `grade6.ts` 계절: "남중 고도가 높을수록 낮의 길이가 길어집니다"(직접 인과) → "둘 다 자전축 기울기·공전 때문에 함께 변한다"로 정정.
- `grade3.ts` 달: "물과 공기가 없어서" → "숨 쉴 공기와 액체 상태의 물이 거의 없어서"로 완화.

### 5. 이미지-단원 매칭 약함 + 오타 ✅ 수정
- 재사용으로 부정확했던 4단원에 전용 SVG 신규 제작·연결:
  - 물질의 성질(g3) states-of-matter → **matter-and-materials**
  - 혼합물의 분리(g4) dissolving → **mixture-separation**
  - 산과 염기(g5) dissolving → **acid-base-indicator**
  - 물체의 운동(g5) energy-forms → **motion-speed**
- `states-of-matter.svg` 오타 "모양은 변" → "모양은 변함".

## 검증 (수정 후)
- typecheck PASS / build PASS / eslint 0
- figureId ↔ SVG 49/49 매칭(누락·미사용 0)
- 데스크탑 정상, 모바일 레이아웃 분기 구현(실기기 시각 확인 권장)

## 비고
- Codex 작업트리 변경 없음(검수만). `types.ts`의 "과학과 사회" 추가는 Claude의 중학교 반영분.
- 출처: NCIC https://ncic.re.kr/bbs/ncicnotice/view/845.do
