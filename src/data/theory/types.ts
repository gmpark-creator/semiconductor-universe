// data/theory/types.ts
// 기초이론(대분류) — 학교 과학 등 "읽는 공부자료" 영역의 타입.
// 산업(AtlasArea, 3D)과 달리 텍스트+도해(SVG)로 구성된 학습 콘텐츠 트리.

/** 과학 영역. 단원 색상 분류에 사용. (중등 2022 개정 통합 단원용 "과학과 사회" 포함) */
export type ScienceDomain = "운동과 에너지" | "물질" | "생명" | "지구와 우주" | "과학과 사회";

export interface KeyTerm {
  term: string;
  desc: string;
}

/** 한 레슨(소단원/개념) — 읽기 본문 + 핵심 용어 + 흥미 사실. */
export interface Lesson {
  id: string;
  title: string;
  body: string[]; // 문단 배열
  keyTerms: KeyTerm[];
  funFact?: string;
}

/** 한 단원 — 도해(figureId) 1개 + 레슨들. */
export interface Unit {
  id: string;
  title: string;
  domain: ScienceDomain;
  summary: string;
  figureId: string; // public/figures/science/<id>.svg
  lessons: Lesson[];
}

/** 한 학년(또는 과목) — 단원 묶음.
 *  초·중등은 학년 단위(label 없으면 "N학년"으로 표시).
 *  고등 선택과목(물리학 등)은 label로 과목명을 표시. */
export interface Grade {
  id?: string; // 고등 선택과목처럼 같은 grade 값이 반복될 때 쓰는 안정 식별자
  grade: number; // 초등 3~6, 중등 1~3, 고등 1=통합과학 / 2~=선택과목
  label?: string; // 지정 시 학년 칩·브레드크럼에 "N학년" 대신 이 이름(예: "물리학")
  units: Unit[];
}

/** 학년/과목 칩에 표시할 이름. label 우선, 없으면 "N학년". */
export function gradeLabel(g: { grade: number; label?: string }): string {
  return g.label ?? `${g.grade}학년`;
}

/** 학교급(초등/중등/고등). 아직 콘텐츠가 없으면 status="준비 중". */
export interface SchoolLevel {
  id: string; // "elementary" | "middle" | "high"
  name: string; // "초등학교"
  shortName: string; // "초등"
  status: "ready" | "coming";
  grades: Grade[];
}

/** 한 과목(과학 …). 학교급들을 묶는다. */
export interface TheorySubject {
  id: string; // "science"
  name: string; // "과학"
  accent: string;
  tagline: string;
  levels: SchoolLevel[];
}

/** 과학 4대 영역 표시 메타(색·아이콘). */
export const DOMAIN_META: Record<ScienceDomain, { color: string; emoji: string; label: string }> = {
  "운동과 에너지": { color: "#f59e0b", emoji: "⚡", label: "물리 · 운동과 에너지" },
  "물질": { color: "#22d3ee", emoji: "⚗️", label: "화학 · 물질" },
  "생명": { color: "#34d399", emoji: "🌱", label: "생물 · 생명" },
  "지구와 우주": { color: "#818cf8", emoji: "🪐", label: "지구과학 · 지구와 우주" },
  "과학과 사회": { color: "#fb7185", emoji: "🌐", label: "통합 · 과학과 사회" },
};

/** 도해 SVG 경로. */
export function figureUrl(figureId: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}figures/science/${figureId}.svg`;
}
