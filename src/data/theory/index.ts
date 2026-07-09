// data/theory/index.ts
// 기초이론 대분류 레지스트리. 과목(과학 …) → 학교급(초/중/고) → 학년 → 단원 트리.
// 새 과목·학교급을 추가하면 여기 배열에만 등록하면 된다.
import type { TheorySubject } from "./types";
import { grade3 } from "./grade3";
import { grade4 } from "./grade4";
import { grade5 } from "./grade5";
import { grade6 } from "./grade6";
import { middle1 } from "./middle1";
import { middle2 } from "./middle2";
import { middle3 } from "./middle3";
import { high1 } from "./high1";
import { highPhysics } from "./high-physics";
import { highChemistry } from "./high-chemistry";
import { high2Biology } from "./high2Biology";
import { high2EarthScience } from "./high2EarthScience";
import { highAdvMechanics } from "./high-adv-mechanics";
import { highAdvEmQuantum } from "./high-adv-em-quantum";
import { highAdvMatterEnergy } from "./high-adv-matter-energy";
import { highAdvReactions } from "./high-adv-reactions";
import { highCareerCellMetabolism } from "./high-career-cell-metabolism";
import { highCareerGenetics } from "./high-career-genetics";
import { highCareerEarthSystems } from "./high-career-earth-systems";
import { highCareerPlanetarySpace } from "./high-career-planetary-space";
import { highFusionHistoryCulture } from "./high-fusion-history-culture";
import { highFusionClimateEcology } from "./high-fusion-climate-ecology";
import { highFusionInquiry } from "./high-fusion-inquiry";
import { threeBodyScience } from "./threebody-science";
import { eeBasic } from "./ee-basic";
import { eeInter } from "./ee-inter";
import { eeAdv } from "./ee-adv";

export const scienceSubject: TheorySubject = {
  id: "science",
  name: "과학",
  emoji: "🔬",
  accent: "#38bdf8",
  tagline: "초등학교부터 차근차근 — 물리·화학·생물·지구과학, 그리고 SF 과학 판별",
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
      status: "ready",
      grades: [middle1, middle2, middle3],
    },
    {
      id: "high",
      name: "고등학교",
      shortName: "고등",
      status: "ready",
      grades: [
        high1,
        highPhysics,
        highChemistry,
        high2Biology,
        high2EarthScience,
        highAdvMechanics,
        highAdvEmQuantum,
        highAdvMatterEnergy,
        highAdvReactions,
        highCareerCellMetabolism,
        highCareerGenetics,
        highCareerEarthSystems,
        highCareerPlanetarySpace,
        highFusionHistoryCulture,
        highFusionClimateEcology,
        highFusionInquiry,
      ],
    },
    {
      id: "sf",
      name: "SF 과학 판별",
      shortName: "SF",
      status: "ready",
      grades: [threeBodyScience],
    },
  ],
};

/** 전기·전자 공학 — 학교 과학이 아닌 '공학' 카테고리. 난이도 3티어(기초/중급/고급)를 SchoolLevel로 매핑.
 *  각 티어=SchoolLevel 1개 + Grade 1개(안정 id + label 필수, track 미지정 — TRACK_ORDER 드롭 회피).
 *  domain "전기·전자 공학"(틸 #14b8a6, 🔌) + strand 라벨. 학교물리 전자기 재유도 없이 소자·회로·디지털·신호·임베디드로 차별화. */
export const eeSubject: TheorySubject = {
  id: "ee",
  name: "전기·전자 공학",
  emoji: "🔌",
  accent: "#14b8a6",
  tagline: "회로를 읽고 만드는 공학 — 부품·직류회로에서 반도체 소자·디지털·신호처리·임베디드까지, 기초→중급→고급으로.",
  levels: [
    { id: "ee-tier-basic", name: "기초", shortName: "기초", status: "ready", grades: [eeBasic] },
    { id: "ee-tier-inter", name: "중급", shortName: "중급", status: "ready", grades: [eeInter] },
    { id: "ee-tier-adv", name: "고급", shortName: "고급", status: "ready", grades: [eeAdv] },
  ],
};

/** 기초이론에 등록된 모든 과목. */
export const THEORY_SUBJECTS: TheorySubject[] = [scienceSubject, eeSubject];

export const DEFAULT_SUBJECT_ID = scienceSubject.id;

export * from "./types";
