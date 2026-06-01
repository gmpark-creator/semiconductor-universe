// data/theory/index.ts
// 기초이론 대분류 레지스트리. 과목(과학 …) → 학교급(초/중/고) → 학년 → 단원 트리.
// 새 과목·학교급을 추가하면 여기 배열에만 등록하면 된다.
import type { TheorySubject } from "./types";
import { grade3 } from "./grade3";
import { grade4 } from "./grade4";
import { grade5 } from "./grade5";
import { grade6 } from "./grade6";

export const scienceSubject: TheorySubject = {
  id: "science",
  name: "과학",
  accent: "#38bdf8",
  tagline: "초등학교부터 차근차근 — 물리·화학·생물·지구과학 기초 이론",
  levels: [
    {
      id: "elementary",
      name: "초등학교",
      shortName: "초등",
      status: "ready",
      grades: [grade3, grade4, grade5, grade6],
    },
    {
      id: "middle",
      name: "중학교",
      shortName: "중등",
      status: "coming",
      grades: [],
    },
    {
      id: "high",
      name: "고등학교",
      shortName: "고등",
      status: "coming",
      grades: [],
    },
  ],
};

/** 기초이론에 등록된 모든 과목. */
export const THEORY_SUBJECTS: TheorySubject[] = [scienceSubject];

export const DEFAULT_SUBJECT_ID = scienceSubject.id;

export * from "./types";
