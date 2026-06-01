# 2026-06-01 Codex Handoff — 고등 진로·융합 선택 과학 확장

## Slice

KA-HIGH-ADV-CODEX-1

## 범위

Codex 담당 고등 심화/선택 과학 7과목을 Knowledge Atlas 기초이론 → 과학 → 고등학교에 추가했다.

- 진로 선택 · 생명과학
  - 세포와 물질대사
  - 생물의 유전
- 진로 선택 · 지구과학
  - 지구시스템과학
  - 행성우주과학
- 융합 선택
  - 과학의 역사와 문화
  - 기후변화와 환경생태
  - 융합과학 탐구

## 구현 파일

- `src/data/theory/high-career-cell-metabolism.ts`
- `src/data/theory/high-career-genetics.ts`
- `src/data/theory/high-career-earth-systems.ts`
- `src/data/theory/high-career-planetary-space.ts`
- `src/data/theory/high-fusion-history-culture.ts`
- `src/data/theory/high-fusion-climate-ecology.ts`
- `src/data/theory/high-fusion-inquiry.ts`
- `src/data/theory/index.ts`
- `public/figures/science/adv-*.svg` 21종

## 구성 원칙

- 기존 고등 일반 선택 과목과 같은 `Grade` 단위 파일 구조를 따랐다.
- 각 과목은 3개 핵심 단원으로 구성했다.
- `strand`는 배지에서 선택군이 보이도록 `진로 선택 · 생명과학`, `진로 선택 · 지구과학`, `융합 선택 · ...` 형식으로 지정했다.
- 각 단원은 독립 `figureId`를 가지며, 대응 SVG를 `public/figures/science/`에 추가했다.

## 교육과정 기준 참고

- 2022 개정 과학과 교육과정 최종안(KOFAC/KOSAC CDN): 진로 선택 및 융합 선택 과목 체계와 과목별 성격을 기준으로 삼았다.
- 부산시교육청 고교학점제 과목 안내: 고등 과학 과목군의 일반 선택, 진로 선택, 융합 선택 분류 확인에 사용했다.
- 서울과학교육 웹진 2022 개정 과학과 교육과정 변화 소개: 융합 선택 신설 취지 확인에 사용했다.

## Claude 검수 요청 포인트

- 세포와 물질대사: 세포호흡·광합성 단계 설명에서 고등 진로 선택 수준 대비 과소/과대 설명 여부.
- 생물의 유전: 비멘델 유전, 집단 유전, 생명공학 윤리 서술의 단순화 정도.
- 지구시스템과학: 지구 내부 구조, 판 구조론, 대기·해양 상호작용의 용어 정확성.
- 행성우주과학: 외계 행성 탐색법, H-R도, 우주 탐사 윤리의 수준 적합성.
- 융합 선택 3과목: 과학 개념보다 사회·탐구 방법 설명이 많으므로, Knowledge Atlas의 "기초이론" 톤과 잘 맞는지 확인.
