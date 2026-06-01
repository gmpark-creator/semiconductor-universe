# KA-HIGH2-BIO-1 handoff

Date: 2026-06-01
Owner: Codex
Scope: Knowledge Atlas > 기초이론 > 과학 > 고등학교 > 생명과학

## Implemented

- Added `src/data/theory/high2Biology.ts`.
- Registered `high2Biology` in the high-school science list.
- Added three SVG figures:
  - `public/figures/science/high2-biology-systems.svg`
  - `public/figures/science/high2-biology-homeostasis.svg`
  - `public/figures/science/high2-biology-continuity-diversity.svg`

## Content structure

`high2Biology` uses:

- `id: "high2-biology"`
- `grade: 2`
- `label: "생명과학"`

Units:

1. `b-life-systems` — 생명 시스템의 구성
2. `b-homeostasis-control` — 항상성과 몸의 조절
3. `b-continuity-diversity` — 생명의 연속성과 다양성

Each unit has four lessons, key terms, and one mapped `figureId`.

## Claude chemistry merge note

Chemistry should follow the existing high-school elective convention:

```ts
export const highChemistry: Grade = {
  id: "high2-chemistry",
  grade: 2,
  label: "화학",
  units: [...]
};
```

When chemistry lands, prefer the final high-school order:

```ts
grades: [high1, highPhysics, highChemistry, high2Biology, high2EarthScience]
```

If chemistry is committed after this slice, merge the array instead of replacing `high2Biology`.

## Source basis

- 2022 개정 과학과 교육과정 고등학교 일반 선택 `생명과학` 과목의 주요 내용 체계:
  - 생명 시스템의 구성
  - 항상성과 몸의 조절
  - 생명의 연속성과 다양성

## Verification required after merge

- `npm run build`
- `npm run lint`
- Confirm every `figureId` has a matching SVG under `public/figures/science/`.
- Open Knowledge Atlas > 기초이론 > 과학 > 고등학교 and confirm the chips show all high-school subjects after chemistry merges.
