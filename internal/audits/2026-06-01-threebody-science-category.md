# Three-Body Science Category Receipt

Slice: KA-THREEBODY-SCIENCE
Date: 2026-06-01
Branch: codex

## Scope

Add a separate `기초이론 > 과학` category that organizes science concepts from Liu Cixin's *The Three-Body Problem* trilogy by separating:

- novel-scale imaginative devices
- physically observed or actively researched science
- overextended, speculative, or currently impossible elements

No copyrighted novel prose is quoted; all content is paraphrased as educational analysis.

## Implementation

- Added `SF 과학` as a science domain with its own visual metadata.
- Added `SF 과학 판별` as a separate science level under the existing science subject.
- Added `삼체 과학` as a standalone grade/category with four units:
  - `세 개의 태양과 혼돈 궤도`
  - `양자 통신과 소폰`
  - `성간 항행과 우주 공학`
  - `우주 문명과 위험 상상`
- Added four SVG figures matching the new unit `figureId` values.
- Updated the top navigation subtitle to include `SF`.

## Source Anchors

- NASA on Alpha Centauri as a triple-star system and nearby exoplanet context: https://science.nasa.gov/exoplanets/other-stars-other-worlds/our-nearest-celestial-neighbor-an-exotic-3-star-system/
- NASA on triple-star and multi-star exoplanet examples: https://www.nasa.gov/missions/kepler/planetary-sleuthing-finds-triple-star-world/
- Caltech Science Exchange on quantum entanglement and the no faster-than-light communication misconception: https://scienceexchange.caltech.edu/topics/quantum-science-explained/entanglement
- NASA STASH/torpor research for space health: https://www.nasa.gov/general/studying-torpor-in-animals-for-space-health-in-humans/
- NASA space nuclear propulsion overview: https://www.nasa.gov/space-technology-mission-directorate/tdm/space-nuclear-propulsion/
- NASA solar sail mission/technology overview: https://www.nasa.gov/mission/acs3
- NASA SETI and technosignature background: https://www.nasa.gov/history/nasa-and-seti/

## Verification

- `npm run build`: PASS
  - Existing Vite chunk-size warning remains; not introduced by this slice.
- `npm run lint`: PASS
- Figure references: PASS — 133 refs, 131 unique ids, 0 missing files
- SVG XML parse: PASS — 131 files, 0 invalid files
- Browser smoke test: PASS — Vite dev server HTTP 200 at `http://127.0.0.1:5173/`

## Residual Risk

This is a curated educational synthesis, not a physics paper. It intentionally frames uncertain items as `판정` rather than claiming final proof about hypothetical civilizations or future engineering.
