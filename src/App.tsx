import { useState } from "react";
import { IndustryView } from "./views/IndustryView";
import { TheoryView } from "./views/TheoryView";
import { SectionNav, type Section } from "./ui/SectionNav";

/**
 * Knowledgeverse(놀리지버스) — 대분류 2층 구조의 최상위 셸.
 *  · 산업    → 3D 지식 영역(반도체·전력 …)
 *  · 기초이론 → 학교 과학 학습 자료(초/중/고)
 *
 * 박사 지시 2026-06-14 — 카테고리 선택을 외부 「시작페이지(허브)」로 이전.
 *  · ?section=industry|theory : 진입 시 초기 대분류 지정.
 *  · ?hub=1 (또는 ?section= 동반) : 허브에서 열린 모드 — 상단 중복 SectionNav 숨김.
 *  · 파라미터 없이 직접 접근하면 기존 동작 그대로(산업 + SectionNav 노출).
 */
function readParams(): { section: Section; hubMode: boolean } {
  try {
    const p = new URLSearchParams(window.location.search);
    const s = p.get("section");
    const section: Section = s === "theory" ? "theory" : "industry";
    const hubMode = p.get("hub") === "1" || s === "theory" || s === "industry";
    return { section, hubMode };
  } catch {
    return { section: "industry", hubMode: false };
  }
}

export default function App() {
  const [{ section: initialSection, hubMode }] = useState(readParams);
  const [section, setSection] = useState<Section>(initialSection);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {section === "industry" ? <IndustryView /> : <TheoryView />}
      {!hubMode && <SectionNav section={section} onChange={setSection} />}
    </div>
  );
}
