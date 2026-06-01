// brand.ts
// 서비스 브랜드 단일 소스. 이름을 바꾸려면 이 파일만 고치면
// 상단 워드마크(SectionNav)와 기초이론 브레드크럼(TheoryView)에 즉시 반영된다.
//
// 컨셉: 지식(Knowledge) + 유니버스(-verse). 각 지식 영역이 하나의 우주,
//       그 전체가 「놀리지버스 / Knowledgeverse」. (영문 표기 사용)
export const BRAND = {
  /** 워드마크 윗줄 */
  kicker: "Knowledge",
  /** 워드마크 아랫줄 */
  main: "Verse",
  /** 풀네임(영문 표기) */
  full: "Knowledgeverse",
} as const;
