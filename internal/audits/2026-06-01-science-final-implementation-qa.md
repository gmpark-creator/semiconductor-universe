# Science Final Implementation QA

Slice: KA-SCIENCE-FINAL-IMPL-QA-1
Date: 2026-06-01
Branch: codex

## Scope

Implementation-only QA for Knowledge Atlas > Basic Theory > Science after the high-school advanced/fusion content merge.

Out of scope: scientific wording/data corrections in `src/data/theory/**`, which are assigned to Claude/Newton.

## Checks

- `npm run build`: PASS
- `npm run lint`: PASS
- Figure references: 129 refs, 127 unique ids, 0 missing files
- SVG XML parse: 127 files, 0 invalid files
- High-school track metadata: 16 high-school course files, all track values present
- Browser smoke test: desktop 1440x1000 and mobile 390x844
  - Entered Basic Theory from top section nav: PASS
  - Opened High School level: PASS
  - Opened advanced `역학과 에너지`: PASS
  - Track labels `공통`, `일반 선택`, `진로 선택`, `융합 선택`: PASS
  - Selected figure rendered with 0 broken images: PASS
  - Horizontal viewport overflow: 0 on both checked viewports

## Implementation Adjustments

- Added horizontal scrollbar height for `.thin-scroll` so mobile grade/course scrolling does not render as an oversized native bar.
- Updated the top section nav subtitle from `과학 · 초중고` to `과학 · 초중고·심화` so the shell reflects the newly added advanced science coverage.

## Residual Risk

This QA verifies structure, rendering, navigation, and asset linkage. It does not replace Claude/Newton's science-content review.
