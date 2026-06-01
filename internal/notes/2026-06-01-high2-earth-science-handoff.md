# KA-HIGH2-EARTH-1 handoff

Date: 2026-06-01
Owner: Codex
Scope: Knowledge Atlas > 기초이론 > 과학 > 고등학교 > 지구과학

## Implemented

- Added `src/data/theory/high2EarthScience.ts`.
- Registered it in the high-school science list as `high2EarthScience`.
- Added four SVG figures:
  - `public/figures/science/high2-atmosphere-ocean.svg`
  - `public/figures/science/high2-earth-history.svg`
  - `public/figures/science/high2-solar-stars.svg`
  - `public/figures/science/high2-galaxy-universe.svg`
- Added stable high-school elective support:
  - `Grade.id?: string`
  - `Grade.label?: string`
  - `gradeLabel(...)`
  - grade chip key fallback: `g.id ?? \`${g.grade}-${g.label ?? i}\``

## Content structure

`high2EarthScience` uses:

- `id: "high2-earth-science"`
- `grade: 2`
- `label: "지구과학"`

Units:

1. `h2-earth-atmosphere-ocean` — 대기와 해양의 상호작용
2. `h2-earth-history-rocks` — 지구의 역사와 한반도의 암석
3. `h2-earth-solar-system-stars` — 태양계 천체와 별
4. `h2-earth-galaxy-universe` — 은하와 우주의 진화

Each unit has three lessons, key terms, and one mapped `figureId`.

## Claude merge note

Physics and chemistry should follow the same high-school elective convention:

```ts
export const highPhysics: Grade = {
  id: "high2-physics",
  grade: 2,
  label: "물리학",
  units: [...]
};

export const highChemistry: Grade = {
  id: "high2-chemistry",
  grade: 2,
  label: "화학",
  units: [...]
};
```

When merging the high-school registry, keep every elective in the array instead of replacing another agent's subject:

```ts
grades: [high1, highPhysics, highChemistry, high2EarthScience]
```

`생명과학` remains the remaining high-school science subject after physics, chemistry, and earth science.

## Source basis

- 2022 개정 과학과 교육과정의 지구과학 영역 구성을 기준으로 잡음.
- Main organizing strands used here:
  - 대기와 해양의 상호작용
  - 지구의 역사와 한반도의 암석
  - 태양계 천체와 별과 우주의 진화

## Verification required after merge

- `npm run build`
- `npm run lint`
- Confirm every `figureId` has a matching SVG under `public/figures/science/`.
- Open Knowledge Atlas > 기초이론 > 과학 > 고등학교 and confirm the chips show `통합과학`, `물리학`, `화학`, `지구과학`, `생명과학` as subjects after all agents merge.
