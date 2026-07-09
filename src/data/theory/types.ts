// data/theory/types.ts
// 기초이론(대분류) — 학교 과학 등 "읽는 공부자료" 영역의 타입.
// 산업(AtlasArea, 3D)과 달리 텍스트+도해(SVG)로 구성된 학습 콘텐츠 트리.

/** 과학 영역. 단원 색상 분류에 사용. (중등 2022 개정 통합 단원과 SF 판별 단원 포함) */
export type ScienceDomain =
  | "운동과 에너지"
  | "물질"
  | "생명"
  | "지구와 우주"
  | "과학과 사회"
  | "SF 과학"
  | "전기·전자 공학"; // 공학 카테고리(과학 아님). 타입명은 파급상 유지 — 새 멤버만 추가.

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
  strand?: string; // 고등 물리학처럼 한 domain 안에서 세부 영역 구분(예: "전기와 자기"). 배지·네비 라벨에 우선 사용.
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
  track?: "공통" | "일반 선택" | "진로 선택" | "융합 선택"; // 고등학교 과목군 표시용. 없으면 학년/기본 흐름으로 표시.
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
  emoji?: string; // 과목 스위처·헤더 아이콘(미지정 시 "🔬"). 과학="🔬", 전기·전자 공학="🔌".
  accent: string;
  tagline: string;
  levels: SchoolLevel[];
}

/** 과학 영역 표시 메타(색·아이콘). */
export const DOMAIN_META: Record<ScienceDomain, { color: string; emoji: string; label: string }> = {
  "운동과 에너지": { color: "#f59e0b", emoji: "⚡", label: "물리 · 운동과 에너지" },
  "물질": { color: "#22d3ee", emoji: "⚗️", label: "화학 · 물질" },
  "생명": { color: "#34d399", emoji: "🌱", label: "생물 · 생명" },
  "지구와 우주": { color: "#818cf8", emoji: "🪐", label: "지구과학 · 지구와 우주" },
  "과학과 사회": { color: "#fb7185", emoji: "🌐", label: "통합 · 과학과 사회" },
  "SF 과학": { color: "#a78bfa", emoji: "🧭", label: "SF 판별 · 과학과 상상" },
  "전기·전자 공학": { color: "#14b8a6", emoji: "🔌", label: "공학 · 전기·전자" },
};

/** DOMAIN_META 조회 실패 시 graceful degrade용 fallback(회색 뱃지). */
const FALLBACK_DOMAIN_META = { color: "#64748b", emoji: "📘", label: "기타" } as const;

/** domain 메타 안전 조회. 알 수 없는 domain이면 크래시 대신 회색 fallback을 돌려준다.
 *  (기존 DOMAIN_META[domain] 직접 참조는 방어가 없어 오타 domain에서 런타임 크래시가 났다.) */
export function domainMeta(d: ScienceDomain | string): { color: string; emoji: string; label: string } {
  return (DOMAIN_META as Record<string, { color: string; emoji: string; label: string }>)[d] ?? FALLBACK_DOMAIN_META;
}

/** 단원 배지·네비에 표시할 영역 라벨. strand(표시 라벨 override, 예: "물리 · 전기와 자기", "통합과학")가
 *  있으면 그것을, 없으면 도메인 라벨을 쓴다. 통합과학처럼 여러 분야가 섞인 단원이 단일 분야로 오인되는 것을 막는다. */
export function unitLabel(u: { domain: ScienceDomain; strand?: string }): string {
  return u.strand ?? domainMeta(u.domain).label;
}

/** 도해 SVG 경로. */
export function figureUrl(figureId: string): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}figures/science/${figureId}.svg`;
}
